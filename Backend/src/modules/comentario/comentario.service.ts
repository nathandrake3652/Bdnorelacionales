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
      username: usuario.username,
    },
    publicacion: {
      id: new Types.ObjectId(dto.publicacionId),
    },
    parentCommentId: dto.parentCommentId ? new Types.ObjectId(dto.parentCommentId) : undefined,
  });

  // Determinar a quién notificar
  if (dto.parentCommentId) {
    // Es una respuesta a un comentario
    const comentarioPadre = await this.comentarioRepo.findById(dto.parentCommentId);
    if (comentarioPadre) {
      await this.noti.crearNotificacion({
        usuarioDestinoId: comentarioPadre.author.id.toString(),
        origenUsuarioId: dto.authorId,
        origenUsername: usuario.username,
        tipo: 'respuesta',
        comentarioId: dto.parentCommentId,
      });
    }
  } else {
    // Es un comentario a la publicación
    const publicacion = await this.publi.findById(dto.publicacionId);
    if (publicacion) {
      await this.noti.crearNotificacion({
        usuarioDestinoId: publicacion.author.id.toString(),
        origenUsuarioId: dto.authorId,
        origenUsername: usuario.username,
        tipo: 'comentario',
        postId: dto.publicacionId,
      });
    }
  }

  return nuevoComentario;
}

  async getPorPublicacion(publicacionId: string): Promise<ComentarioPlano[]> {
  const comentarios = await this.comentarioRepo.findByPublicacion(publicacionId);

  const comentarioMap = new Map<string, ComentarioPlano>();
  const resultado: ComentarioPlano[] = [];

  comentarios.forEach((c: any) => {
  const plano: ComentarioPlano = {
    _id: c._id.toString(),
    content: c.content,
    score: (c.votos || []).reduce((acc, v) => acc + v.valor, 0),
    author: {
      id: typeof c.author?.id === 'object' ? c.author.id._id?.toString() : c.author?.id?.toString(),
      username: c.author?.username,
    },
    publicacion: {
      id: c.publicacion.id.toString(),
    },
    parentCommentId: c.parentCommentId ? c.parentCommentId.toString() : undefined,
    replies: [],
  };

    comentarioMap.set(plano._id, plano);
  });

  comentarios.forEach(c => {
    const id = c._id.toString();
    const parentId = c.parentCommentId?.toString();
    const actual = comentarioMap.get(id);

    if (parentId && comentarioMap.has(parentId)) {
      comentarioMap.get(parentId)!.replies!.push(actual!);
    } else {
      resultado.push(actual!);
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

async obtenerComentariosPorUsuario(usuarioId: string) {
  const comentarios = await this.comentarioRepo.findByUsuarioId(usuarioId);
  
  return comentarios.map(c => ({
    _id: c._id.toString(),
    content: c.content,
    author: c.author,
    publicacion: c.publicacion,
    parentCommentId: c.parentCommentId,
    score: (c.votos || []).reduce((acc, v) => acc + v.valor, 0),
  }));
}
  async eliminarComentario(id: string) {
    const comentario = await this.comentarioRepo.deleteById(id);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }
    return `Comentario con id ${id} eliminado correctamente`;
  }

  async obtenerComentariosPorFiltro(id: string, filtro: 'publicacion' | 'comentario') {
  if (filtro === 'publicacion') {
    return this.comentarioRepo.findRaizByPublicacion(id);
  } else if (filtro === 'comentario') {
    return this.comentarioRepo.findRespuestasByComentario(id);
  } else {
    throw new Error('Filtro no válido');
  }
}



}

export interface ComentarioPlano {
  _id: string;
  content: string;
  score: number;
  author: {
    id: string;
    username: string;
  };
  publicacion: {
    id: string;
  };
  parentCommentId?: string;
  replies?: ComentarioPlano[];
}
