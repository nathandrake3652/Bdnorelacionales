import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    @Post('login')
    login(@Body()
    loginDto: LoginDto,) { 
        return this.authService.login(loginDto);
      }

    @Post('register')
    register(@Body()
    registerDto: RegistroDto,) {
        console.log(registerDto); 
        return this.authService.register(registerDto); 
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(
        @Request() req
    ) {
     return req.user.lean(); 
    }
    
    @Post('anonimo')
    async createAnonymousUser() {
        const anonid = await this.authService.CreateAnonymousUser();
        return { anonid };
    }
    @Get('anonimo/:anonid')
    async getAnonymousUser(@Param('anonid') anonid: string) {
        console.log('ID recibido:', anonid);
        const key = `anon:${anonid}`;
        console.log('Buscando en Redis:', key);
        const datos = await this.authService.getAnonymousUser(anonid);
        return datos;
    }
    
    
    






}

