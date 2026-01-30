import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
    Request
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/orders.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiBody,
    ApiQuery,
    ApiParam
} from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Создать заказ (проверка stock, уменьшение остатков)' })
    @ApiBody({ type: CreateOrderDto })
    @ApiCreatedResponse({ description: 'Заказ создан' })
    @ApiBadRequestResponse({ description: 'Недостаточно товара на складе' })
    @ApiNotFoundResponse({ description: 'Товар не найден' })
    create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Список заказов пользователя' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiOkResponse({ description: 'Список заказов' })
    findAll(
        @Request() req,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        return this.ordersService.findAll(req.user.userId, +page, +limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Детали заказа' })
    @ApiParam({ name: 'id', example: 1 })
    @ApiOkResponse({ description: 'Заказ найден' })
    @ApiNotFoundResponse({ description: 'Заказ не найден' })
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOne(id, req.user.userId);
    }
}