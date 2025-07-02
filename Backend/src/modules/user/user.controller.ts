import { Controller, Get, Post, Body, Param} from '@nestjs/common';
import { UsuarioService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from 'src/interface/ApiResponse';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsuarioService) {}

  @Post("createUser")
    create(@Body() createUserDto: CreateUserDto) {
    const {username,  password, correo} = createUserDto
    return this.userService.createUsuario({username,  correo, password});
  }
  @Get("user/:correo") 
    getUser(@Param("correo") correo: string):Promise<ApiResponse<any>> {
    return this.userService.findUsuarioByCorreo(correo);
}




  
}
