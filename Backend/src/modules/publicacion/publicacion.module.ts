import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
    UserModule // Importa el módulo de Usuario si es necesario
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class PublicacionModule {}