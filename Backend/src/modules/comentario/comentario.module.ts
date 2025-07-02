// src/modules/comentario/comentario.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ComentarioRepository } from './comentario.repository';
import { ComentarioService } from './comentario.service';
import { Comentario, ComentarioSchema } from './schemas/comentario.schema';
import { UserModule } from '../user/user.module';
import { UsuarioRepository } from '../user/user.repository';
import { ComentarioController } from './comentario.controller';
import { NotificacionModule } from '../notificacion/notificacion.module';
import { PublicacionModule } from '../publicacion/publicacion.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }]),
    UserModule,
    NotificacionModule,
    PublicacionModule
  ],
  controllers: [ComentarioController],
  providers: [ComentarioService, ComentarioRepository],
  exports: [ComentarioService],
})
export class ComentarioModule {}