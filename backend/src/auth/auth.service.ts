import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, UserPublicResponse } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new UnauthorizedException('User already exists');
        }

        const user = await this.usersService.create(
            registerDto.email,
            registerDto.password,
            registerDto.role
        );

        return this.generateToken(user);
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !(await bcrypt.compare(loginDto.password, (user as any).password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password, ...safeUser } = user as any;
        return this.generateToken(safeUser);
    }

    private generateToken(user: UserPublicResponse): { access_token: string } {
        const payload = { sub: user.id, email: user.email, roles: [user.role] };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
