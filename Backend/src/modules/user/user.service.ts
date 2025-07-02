// src/modules/usuario/usuario.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { CreateResponse } from 'src/utils/api-response.util';
import { ApiResponse } from 'src/interface/ApiResponse';
import { Usuario, UsuarioDocument } from './schemas/user.schema';
import { UsuarioRepository } from './user.repository';


@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async createUsuario(data: {
    username: string;
    correo: string;
    password: string;
  }): Promise<Usuario> {
    return this.usuarioRepo.create(data);
  }

  async getAllUsuarios(): Promise<ApiResponse<Usuario[] | null>> {
    const users = await this.usuarioRepo.findAll();
    if (!users.length) {
      throw new HttpException(
        CreateResponse('No hay usuarios registrados', null, 'NOT_FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    return CreateResponse('Usuarios obtenidos correctamente', users, 'OK');
  }

  async findUsuarioByCorreo(correo: string): Promise<ApiResponse<UsuarioDocument | null>> {
    const user = await this.usuarioRepo.findByCorreo(correo);
    //if (!user) {
      //throw new HttpException(
        //CreateResponse('Usuario no encontrado', null, 'NOT_FOUND'),
        //HttpStatus.NOT_FOUND,
      //);
    //}

    return CreateResponse('Usuario encontrado', user, 'OK');
  }
}
