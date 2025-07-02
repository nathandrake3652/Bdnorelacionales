import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema';
import { UserModule } from '../user/user.module';
import { PublicacionController } from './publicacion.controller';
import { PublicacionService } from './publicacion.service';
import { publicacionRepository } from './publicacion.repository';
import { NotificacionModule } from '../notificacion/notificacion.module';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
    UserModule,
    NotificacionModule // Importa el módulo de Usuario si es necesario
  ],
  controllers: [PublicacionController],
  providers: [PublicacionService,publicacionRepository],
  exports: [PublicacionService, publicacionRepository] // Exporta el servicio y repositorio si es necesario en otros módulos,
})
export class PublicacionModule {}