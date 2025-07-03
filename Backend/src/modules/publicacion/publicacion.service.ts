import { Injectable } from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { PublicacionModule } from './publicacion.module';
import { publicacionRepository } from './publicacion.repository';
import { UsuarioRepository } from '../user/user.repository';
import { UsuarioDocument } from '../user/schemas/user.schema';
import { Types } from 'mongoose';
import { VotarDto } from './dto/votar.dto';
import { NotificacionService } from '../notificacion/notificacion.service';

import { PremioRepository } from '../premio/premio.repository';
import { AsignarPremioDto } from './dto/asignar-premio.dto';
import { EtiquetaService } from '../etiqueta/etiqueta.service';

@Injectable()
export class PublicacionService {
  constructor(private readonly publirepo: publicacionRepository,
    private readonly userRepo: UsuarioRepository,
    private readonly noti: NotificacionService, // Asegúrate de importar el servicio de notificaciones
    private readonly premioRepository: PremioRepository, // Asegúrate de importar el repositorio de premios
    private readonly etiquetaService: EtiquetaService
    
    
  ) {}
  
  async create(dto: CreatePublicacionDto) {
    const user = await this.userRepo.findById(dto.authorId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    for (const nombreTag of dto.tags) {
    const existente = await this.etiquetaService.FindByNombre(nombreTag);
    if (!existente) {
      await this.etiquetaService.create({ nombre: nombreTag });
    }
  }
    
    const nuevaPublicacion = this.publirepo.create({
    title: dto.title,
    media: dto.media,
    author: {
    id: user._id as Types.ObjectId, 
    username: user.username, 
    },
    tags: dto.tags,
    createdAt: new Date(),
    votos: [],
    premios: [],
    });
    

    return 'Publicación creada correctamente';
  }

  async findAll() {
  const publicaciones = await this.publirepo.findAll();
  if (!publicaciones || publicaciones.length === 0) {
    return []; // Retorna un array vacío si no hay publicaciones
  }
    return publicaciones.map(pub => ({
    _id: pub._id as Types.ObjectId,
    title: pub.title,
    media: pub.media,
    author: pub.author,
    tags: pub.tags,
    createdAt: pub.createdAt,
    premios: pub.premios,
    score: pub.votos.reduce((total, voto) => total + voto.valor, 0), 
  }));
  }

  async findOne(id: string) {
   const publicacion = await this.publirepo.findById(id.toString());
    return {
      _id: publicacion._id as Types.ObjectId,
      title: publicacion.title,
      media: publicacion.media,
      author: publicacion.author,
      tags: publicacion.tags,
      createdAt: publicacion.createdAt,
      premios: publicacion.premios,
      score: publicacion.votos.reduce((total, voto) => total + voto.valor, 0),
    };
  }

  update(id: number, updatePublicacionDto: UpdatePublicacionDto) {
    return `This action updates a #${id} publicacion`;
  }

  async remove(id: string) {
    await this.publirepo.deletebyId(id.toString());
    return `publicación con id ${id} eliminada correctamente`;
  }
  
  async votar(dto: VotarDto) {
  const { idPublicacion, idVotador, score } = dto;

  if (![1, -1].includes(score)) {
    throw new Error('El valor del voto debe ser 1 (positivo) o -1 (negativo).');
  }

  const publicacion = await this.publirepo.findById(idPublicacion);
  if (!publicacion) {
    throw new Error('Publicación no encontrada');
  }

  const votadorId = new Types.ObjectId(idVotador);

  const votoIndex = publicacion.votos.findIndex(
    v => v.userId.toString() === idVotador,
  );

  if (votoIndex !== -1) {
    if (publicacion.votos[votoIndex].valor === score) {
      // Ya votó lo mismo, se elimina el voto
      publicacion.votos.splice(votoIndex, 1);
    } else {
      // Voto diferente, se actualiza
      publicacion.votos[votoIndex].valor = score;
    }
  } else {
    // Nuevo voto
    publicacion.votos.push({
      userId: votadorId,
      valor: score,
    });
  }

  const actualizada = await this.publirepo.updateVotosArray(idPublicacion, publicacion.votos);
  if (!actualizada) {
    throw new Error('Error al actualizar los votos de la publicación');
  }
  // Notificar al autor de la publicación
  const autorId = actualizada.author.id.toString();
  if (autorId !== idVotador) {
    await this.noti.crearNotificacion({
      usuarioDestinoId: autorId,
      origenUsuarioId: idVotador,
      origenUsername: (await this.userRepo.findById(idVotador)).username,
      tipo: 'voto',
      postId: idPublicacion,
    });
  }

  const puntuacion = actualizada.votos.reduce((total, voto) => total + voto.valor, 0);
  return {
    mensaje: 'Voto procesado correctamente',
    votos: puntuacion,
  };
}
async getPublicacionesporfiltro(tipo: string){
  const publicaciones = await this.publirepo.findAll();
  let ordenadas;

  switch (tipo) {
    case 'Puntuación (Mayor a Menor)':
      ordenadas = publicaciones.sort((a, b) => 
        b.votos.reduce((acc, v) => acc + v.valor, 0) -
        a.votos.reduce((acc, v) => acc + v.valor, 0)
      );
      break

    case 'Puntuación (Menor a Mayor)':
      ordenadas = publicaciones.sort((a, b) => 
        a.votos.reduce((acc, v) => acc + v.valor, 0) -
        b.votos.reduce((acc, v) => acc + v.valor, 0)
      );
      break
    case 'Más recientes':
      ordenadas = publicaciones.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'Sin filtro':
    default:
      ordenadas = publicaciones;
}
  return ordenadas.map(p => ({
    ...p.toObject?.() ?? p,
    score: p.votos.reduce((acc, v) => acc + v.valor, 0),
  }));

}
async getPorUsuario(userId: string) {
  const publicaciones = await this.publirepo.findByAuthor(userId);
  return publicaciones.map(p => ({
    ...p.toObject?.() ?? p,
    score: p.votos.reduce((acc, v) => acc + v.valor, 0),
  }));
}

async getPorEtiquetaYFiltro(etiqueta: string, filtro: string) {
  const publicaciones = await this.publirepo.findByEtiqueta(etiqueta);

  let ordenadas;

  switch (filtro) {
    case 'populares':
      ordenadas = publicaciones.sort((a, b) =>
        b.votos.reduce((acc, v) => acc + v.valor, 0) -
        a.votos.reduce((acc, v) => acc + v.valor, 0)
      );
      break;
    case 'recientes':
      ordenadas = publicaciones.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'Sin filtro':
    default:
      ordenadas = publicaciones;
  }

  return ordenadas.map(p => ({
    ...p.toObject?.() ?? p,
    score: p.votos.reduce((acc, v) => acc + v.valor, 0),
  }));
}

async asignarPremio(dto: AsignarPremioDto) {
  const { publicacionId, nombrePremio, usuarioId } = dto;

  const publicacion = await this.publirepo.findById(publicacionId);
  if (!publicacion) throw new Error('Publicación no encontrada');

  const premio = await this.premioRepository.findByNombre(nombrePremio);
  if (!premio) throw new Error('Premio no válido');

  const premioExistente = publicacion.premios.find(p => p.id.toString() === premio._id.toString());

  if (premioExistente) {
    premioExistente.numero += 1;
  } else {
    publicacion.premios.push({
      id: premio._id,
      numero: 1,
    });
  }

  await publicacion.save();

  const usuario = await this.userRepo.findById(usuarioId);
  if (!usuario) throw new Error('Usuario no encontrado');
  const userid = usuario.id

  await this.noti.crearNotificacion({
    usuarioDestinoId: publicacion.author.id.toString(),
    origenUsuarioId: userid,
    origenUsername: usuario.username,
    tipo: 'premio',
    postId: dto.publicacionId,
  });

  return publicacion;
}


}
