import { IsEmail, IsString, IsEnum, Length } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'user@mail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Должно быть строкой' })
    @IsEmail({}, { message: 'Неккоректный email' })
    readonly email: string;

    @ApiProperty({ example: '12345678', description: 'Пароль' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(4, 16, {
        message: 'Пароль должен содержать не менее 4 символов и не более 16',
    })
    readonly password: string;

    @ApiProperty({ example: 'ADMIN', description: 'Роль пользователя(user по умолчанию)' })
    @IsEnum(Role)
    role?: Role = Role.USER;
}

export class LoginDto {
    @ApiProperty({ example: 'user@mail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Должно быть строкой' })
    @IsEmail({}, { message: 'Неккоректный email' })
    readonly email: string;

    @ApiProperty({ example: '12345678', description: 'Пароль' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(4, 16, {
        message: 'Пароль должен содержать не менее 4 символов и не более 16',
    })
    readonly password: string;
}