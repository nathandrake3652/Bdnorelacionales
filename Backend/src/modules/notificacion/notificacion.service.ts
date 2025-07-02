import { Injectable } from '@nestjs/common';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { NotificacionRepository } from './notificacion.repository';
import { Types } from 'mongoose';

@Injectable()
export class NotificacionService {
  constructor(
    
     private readonly notificacionRepository: NotificacionRepository,
  ) {}
  
  async crearNotificacion(dto: {
  usuarioDestinoId: string;
  origenUsuarioId: string;
  origenUsername: string;
  tipo: 'comentario' | 'respuesta' | 'voto' | 'premio';
  postId?: string;
  comentarioId?: string;
}) {
  const mensaje = this.generarMensaje(dto.tipo, dto.origenUsername);

  return this.notificacionRepository.create({
    usuarioDestino: new Types.ObjectId(dto.usuarioDestinoId),
    tipo: dto.tipo,
    origen: {
      usuarioId: new Types.ObjectId(dto.origenUsuarioId),
      username: dto.origenUsername,
    },
    postId: dto.postId ? new Types.ObjectId(dto.postId) : undefined,
    comentarioId: dto.comentarioId ? new Types.ObjectId(dto.comentarioId) : undefined,
    mensaje,
    fecha: new Date(),
  });
}
async findByUsuarioDestino(userId: string) {
  return this.notificacionRepository.findByUsuarioDestino(userId);
}


private generarMensaje(tipo: string, origen: string): string {
  switch (tipo) {
    case 'comentario':
      return `${origen} comentó en tu publicación`;
    case 'respuesta':
      return `${origen} respondió a tu comentario`;
    case 'voto':
      return `${origen} votó en tu post`;
    case 'premio':
      return `${origen} te dio un premio`;
    default:
      return `${origen} realizó una acción`;
  }
}









  
 
}




