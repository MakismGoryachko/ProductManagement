import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, OrderItemDto } from './dto/orders.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, dto: CreateOrderDto) {
        const itemsWithProducts = await Promise.all(
            dto.items.map(async (item: OrderItemDto) => {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product || product.deletedAt) {
                    throw new NotFoundException(`Товар ID ${item.productId} не найден`);
                }

                if (product.stock < item.quantity) {
                    throw new BadRequestException(
                        `Недостаточно товара "${product.name}". Запрошено: ${item.quantity}, на складе: ${product.stock}`
                    );
                }

                return {
                    ...item,
                    product,
                    priceAtOrder: product.price,
                };
            })
        );

        return this.prisma.$transaction(async (prisma) => {
            const total = itemsWithProducts.reduce(
                (sum, item) => sum + (Number(item.priceAtOrder) * item.quantity),
                0
            );

            const order = await prisma.order.create({
                data: {
                    userId,
                    total: total.toString(),
                    items: {
                        create: itemsWithProducts.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.priceAtOrder.toString(),
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    user: {
                        select: { id: true, email: true },
                    },
                },
            });

            for (const item of itemsWithProducts) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return order;
        });
    }

    async findAll(userId: number, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        return this.prisma.order.findMany({
            where: { userId },
            skip,
            take: limit,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async findOne(id: number, userId: number) {
        const order = await this.prisma.order.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: { id: true, email: true },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }

        return order;
    }
}