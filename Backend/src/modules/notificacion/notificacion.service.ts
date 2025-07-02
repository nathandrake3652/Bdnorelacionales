import { Injectable } from '@nestjs/common';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Injectable()
export class NotificacionService {
  create(createNotificacionDto: CreateNotificacionDto) {
    return 'This action adds a new notificacion';
  }

 
}
