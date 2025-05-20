import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegistroDto } from './dto/register.dto'; // Assuming you have a DTO for registration
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService, // Assuming you have JwtService injected
        
    ) {}
    
    
    async login({rut, password}: LoginDto) {
        const user = await this.userService.getUserByRut(rut);
        if (!user) {
            throw new BadRequestException('credenciales invalidas');
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('credenciales invalidas');
        }
        const payload = { rut: user.rut, name: user.name };
        const  token = await this.jwtService.signAsync(payload);
        return {
            token,
            user: {
                rut: user.rut,
                name: user.name,
                correo: user.correo,
            },
        };


        
    }

    async register({rut, name, correo, password}: RegistroDto) {
        const user = await this.userService.getUserByRut(rut);
        if (user) {
            throw new BadRequestException('El usuario ya existe');
        }
        return await this.userService.createUser({
            rut, 
            name, 
            correo, 
            password: await bcryptjs.hash(password, 10)});
        
    }
   



}
