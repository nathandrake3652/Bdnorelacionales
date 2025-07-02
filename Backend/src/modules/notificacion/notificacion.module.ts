import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notificacion, NotificacionSchema } from './schemas/notificacion.schema';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { NotificacionRepository } from './notificacion.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notificacion.name, schema: NotificacionSchema }]),
  ],
  controllers: [NotificacionController],
  providers: [NotificacionService, NotificacionRepository],
  exports: [],
})
export class NotificacionModule {}