import { Injectable } from '@nestjs/common';
import { ComentarioRepository } from './comentario.repository';
import { Comentario } from './schemas/comentario.schema';
import { Types } from 'mongoose';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UsuarioRepository } from '../user/user.repository';
import { VotarComentarioDto } from './dto/votarcomentario.dto';
import { NotificacionService } from '../notificacion/notificacion.service';
import { publicacionRepository } from '../publicacion/publicacion.repository';


@Injectable()
export class ComentarioService {
  constructor(private readonly comentarioRepo: ComentarioRepository,
    private readonly userRepo: UsuarioRepository, 
    private readonly noti: NotificacionService,
     private readonly publi: publicacionRepository
  ) {}

  async crearComentario(dto: CreateComentarioDto) {

    const usuario = await this.userRepo.findById(dto.authorId);
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }
  const nuevoComentario = await this.comentarioRepo.create({
    content: dto.content,
    score: 0,
    author: {
      id: new Types.ObjectId(dto.authorId),
      username: usuario.username, // Asegúrate de que el usuario tenga un campo username
    },
    publicacion: {
      id: new Types.ObjectId(dto.publicacionId),
    },
    parentCommentId: dto.parentCommentId ? new Types.ObjectId(dto.parentCommentId) : undefined,
  });
  const publicacion = await this.publi.findById(dto.publicacionId);
  if (!publicacion) {
    throw new Error('Publicación no encontrada');
  }
  await this.noti.crearNotificacion({
    usuarioDestinoId: publicacion.author.id.toString(), // Asegúrate de que publicacion.author.id sea un ObjectId
    origenUsuarioId: dto.authorId,
    origenUsername: usuario.username,
    tipo: 'comentario',
    postId: dto.publicacionId,
  })

  return nuevoComentario;
}
  async getPorPublicacion(publicacionId: string) {
  const comentarios = await this.comentarioRepo.findByPublicacion(publicacionId) 

  // Crear un mapa de comentarios por ID
  const comentarioMap = new Map<string, any>();
  const resultado: any[] = [];

  comentarios.forEach(c => {
    (c as any).replies = []; 
    comentarioMap.set(c._id.toString(), c);
  });

  comentarios.forEach(c => {
    if (c.parentCommentId) {
      const parent = comentarioMap.get(c.parentCommentId.toString());
      if (parent) {
        parent.replies.push(c);
      }
    } else {
      resultado.push(c);
    }
  });

  return resultado;
}
async votarEnComentario(dto: VotarComentarioDto) {
  const { comentarioId, votadorId, score } = dto;

  if (![1, -1].includes(score)) {
    throw new Error('El score debe ser 1 (positivo) o -1 (negativo)');
  }

  const comentario = await this.comentarioRepo.findById(comentarioId);
  if (!comentario) {
    throw new Error('Comentario no encontrado');
  }

  const votoExistente = comentario.votos.find(v => v.userId.toString() === votadorId);

  if (votoExistente) {
    if (votoExistente.valor === score) {
      // 🗑 El usuario repitió el mismo voto, lo eliminamos (quitar voto)
      comentario.votos = comentario.votos.filter(v => v.userId.toString() !== votadorId);
    } else {
      //  El usuario cambió el voto (por ejemplo de 1 a -1)
      votoExistente.valor = score;
    }
  } else {
    // ➕ Agregar nuevo voto
    comentario.votos.push({
      userId: new Types.ObjectId(votadorId),
      valor: score,
    });
  }

  // Actualizar score acumulado
  comentario.score = comentario.votos.reduce((acc, v) => acc + v.valor, 0);
  await this.comentarioRepo.updateVotosArray(comentarioId, comentario.votos);
  return comentario.score;
}



}
