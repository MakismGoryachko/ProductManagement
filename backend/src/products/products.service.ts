import {
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
    CreateProductDto,
    UpdateProductDto
} from './dto/products.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where: { deletedAt: null },
                skip,
                take: limit,
                orderBy: { id: 'desc' },
            }),
            this.prisma.product.count({ where: { deletedAt: null } }),
        ]);

        return {
            products,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product || product.deletedAt) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async create(data: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                ...data,
                price: data.price.toString(),
            },
        });
    }

    async update(id: number, data: UpdateProductDto) {
        await this.findOne(id);

        return this.prisma.product.update({
            where: { id },
            data: {
                ...data,
                price: data.price?.toString(),
            },
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}