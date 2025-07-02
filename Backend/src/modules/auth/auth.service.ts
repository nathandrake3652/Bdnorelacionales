import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/register.dto';
import { UsuarioService } from '../user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async login({ correo, password }: LoginDto) {
    const result = await this.usuarioService.findUsuarioByCorreo(correo);

    const user = result.data;
    if (!user) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const payload = { correo: user.correo, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      token    };
  }

  async register({ username, correo, password }: RegistroDto) {
    const result = await this.usuarioService.findUsuarioByCorreo(correo);

    if (result.data) {
      throw new BadRequestException('El usuario ya existe');
    }

    const nuevoUsuario = await this.usuarioService.createUsuario({
      username,
      correo,
      password: await bcryptjs.hash(password, 10),
    });

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        correo: nuevoUsuario.correo,
        username: nuevoUsuario.username,
      },
    };
  }

   generarNombreAnonimo(): string {
    const prefijos = ['visitante', 'anonimo', 'invitado', 'usuario'];
    const randomPrefix = prefijos[Math.floor(Math.random() * prefijos.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${randomPrefix}-${randomNum}`;
  }
  async CreateAnonymousUser()  {   
    const anonid = v4();
    const username = this.generarNombreAnonimo();

    const datos = {
      id: anonid,
      username,
      type: 'anonimo',
      creadoEn: new Date().toISOString(),
    };
     await this.cacheManager.set(`anon:${anonid}`, datos, 60 * 60 * 60 ); // Guardar por 24 horas
    const payload = { sub: anonid, type: 'anonimo', username: username };
    const token = await this.jwtService.signAsync(payload);

    return {token};
  }

  async getAnonymousUser(anonid: string) {
    const key = `anon:${anonid}`;
    const datos = await this.cacheManager.get(key);
    console.log('Datos encontrados:', datos);
   if (!datos) {
      throw new BadRequestException('Usuario anónimo no encontrado o expirado');
   }
  return datos;
}
}
