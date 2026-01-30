import { IsInt, IsArray, Min, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class OrderItemDto {
    @ApiProperty({ example: 1, description: 'ID товара' })
    @IsInt()
    productId: number;

    @ApiProperty({ example: 2, description: 'Количество', minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;
}

@ApiExtraModels()
export class CreateOrderDto {
    @ApiProperty({
        type: [OrderItemDto],
        example: [
            { productId: 1, quantity: 2 },
            { productId: 3, quantity: 1 }
        ]
    })
    @IsArray()
    items: OrderItemDto[];
}