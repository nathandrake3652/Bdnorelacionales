import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
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
     return req.user; 
    }
    
    






}

