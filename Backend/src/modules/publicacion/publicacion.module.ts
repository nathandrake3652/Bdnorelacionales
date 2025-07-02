import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema';
import { UserModule } from '../user/user.module';
import { PublicacionController } from './publicacion.controller';
import { PublicacionService } from './publicacion.service';
import { publicacionRepository } from './publicacion.repository';
import { NotificacionModule } from '../notificacion/notificacion.module';
import { PremioModule } from '../premio/premio.module';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
    UserModule,
    NotificacionModule,
    PremioModule
  ],
  controllers: [PublicacionController],
  providers: [PublicacionService,publicacionRepository],
  exports: [PublicacionService, publicacionRepository] 
})
export class PublicacionModule {}