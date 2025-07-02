import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notificacion, NotificacionSchema } from './schemas/notificacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notificacion.name, schema: NotificacionSchema }]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class NotificacionModule {}