// src/modules/comentario/comentario.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ComentarioRepository } from './comentario.repository';
import { ComentarioService } from './comentario.service';
import { Comentario, ComentarioSchema } from './schemas/comentario.schema';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }]),
    UserModule
  ],
  providers: [ComentarioService, ComentarioRepository],
  exports: [ComentarioService],
})
export class ComentarioModule {}