import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface UserPublicResponse {
    id: number;
    email: string;
    role: Role;
}

export interface UserPrivateResponse {
    id: number;
    email: string;
    password: string;
    role: Role;
}

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(email: string, password: string, role: Role = Role.USER): Promise<UserPublicResponse> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.users.create({
            data: { email, password: hashedPassword, role },
            select: { id: true, email: true, role: true }
        });
    }

    async findByEmail(email: string): Promise<UserPrivateResponse | null> {
        return this.prisma.users.findUnique({
            where: { email },
            select: { id: true, email: true, password: true, role: true }
        });
    }
}