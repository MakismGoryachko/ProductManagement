import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import {
    ApiProperty,
    ApiPropertyOptional,
    ApiExtraModels,
    ApiCreatedResponse
} from '@nestjs/swagger';

@ApiExtraModels()
export class CreateProductDto {
    @ApiProperty({
        example: 'iPhone 15 Pro',
        description: 'Название товара (обязательное поле)',
        minLength: 1
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        example: 'Последняя модель iPhone с A17 Pro чипом',
        description: 'Описание товара (необязательное)',
        minLength: 1
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 1199.99,
        description: 'Цена товара в USD (обязательное, 2 знака после запятой)'
    })
    @IsNumber()
    price: number;

    @ApiPropertyOptional({
        example: 25,
        description: 'Количество на складе (по умолчанию 0)'
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number;
}

@ApiExtraModels()
export class UpdateProductDto {
    @ApiPropertyOptional({
        example: 'iPhone 15 Pro Max',
        description: 'Новое название (оставьте пустым для неизменности)'
    })
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: 'Обновленное описание с 1TB памяти',
        description: 'Новое описание (оставьте пустым для неизменности)'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        example: 1299.99,
        description: 'Новая цена (оставьте пустым для неизменности)'
    })
    @IsNumber()
    price?: number;

    @ApiPropertyOptional({
        example: 15,
        description: 'Новое количество на складе (оставьте пустым для неизменности)'
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number;
}