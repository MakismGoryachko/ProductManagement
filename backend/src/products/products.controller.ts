import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
    UseGuards
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiBearerAuth,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiCreatedResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { UpdateProductDto, CreateProductDto } from './dto/products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';


@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Получить список товаров с пагинацией' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
        return this.productsService.findAll(+page, +limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить товар по ID' })
    @ApiParam({ name: 'id', description: 'ID товара', example: 1 })
    @ApiOkResponse({ description: 'Товар найден' })
    @ApiNotFoundResponse({ description: 'Товар не найден' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Создать новый товар (только ADMIN)' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateProductDto })
    @ApiCreatedResponse({ description: 'Товар создан' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен (не ADMIN)' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Обновить товар (только ADMIN)' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'ID товара', example: 1 })
    @ApiBody({ type: UpdateProductDto })
    @ApiOkResponse({ description: 'Товар обновлен' })
    @ApiNotFoundResponse({ description: 'Товар не найден' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен (не ADMIN)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Удалить товар (soft delete, только ADMIN)' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'ID товара', example: 1 })
    @ApiOkResponse({ description: 'Товар помечен как удаленный' })
    @ApiNotFoundResponse({ description: 'Товар не найден' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен (не ADMIN)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}