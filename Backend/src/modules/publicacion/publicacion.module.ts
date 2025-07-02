import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema';
import { UserModule } from '../user/user.module';
import { PublicacionController } from './publicacion.controller';
import { PublicacionService } from './publicacion.service';
import { publicacionRepository } from './publicacion.repository';
import { UsuarioRepository } from '../user/user.repository';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
    UserModule // Importa el módulo de Usuario si es necesario
  ],
  controllers: [PublicacionController],
  providers: [PublicacionService,publicacionRepository,Publicacion],
  exports: [PublicacionService],
})
export class PublicacionModule {}