import { Injectable } from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { PublicacionModule } from './publicacion.module';
import { publicacionRepository } from './publicacion.repository';
import { UsuarioRepository } from '../user/user.repository';
import { UsuarioDocument } from '../user/schemas/user.schema';
import { Types } from 'mongoose';
import { VotarDto } from './dto/votar.dto';

@Injectable()
export class PublicacionService {
  constructor(private readonly publirepo: publicacionRepository,
    private readonly userRepo: UsuarioRepository,
    
    
  ) {}
  
  async create(dto: CreatePublicacionDto) {
    const user = await this.userRepo.findById(dto.authorId);
    if (!user) {
      throw new Error('Usuario no encontrado');
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
    throw new Error('No se encontraron publicaciones');
  }
    return publicaciones.map(pub => ({
    _id: pub._id as Types.ObjectId,
    title: pub.title,
    media: pub.media,
    author: pub.author,
    tags: pub.tags,
    createdAt: pub.createdAt,
    premios: pub.premios,
    score: pub.votos.reduce((total, voto) => total + voto.valor, 0), // 💡 suma de votos
  }));
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacion`;
  }

  update(id: number, updatePublicacionDto: UpdatePublicacionDto) {
    return `This action updates a #${id} publicacion`;
  }

  remove(id: string) {
    this.publirepo.deletebyId(id.toString());
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
  
  return {
    mensaje: 'Voto procesado correctamente',
    votos: actualizada.votos,
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
    case 'Puntuación (Mayor a Menor)':
      ordenadas = publicaciones.sort((a, b) =>
        b.votos.reduce((acc, v) => acc + v.valor, 0) -
        a.votos.reduce((acc, v) => acc + v.valor, 0)
      );
      break;
    case 'Puntuación (Menor a Mayor)':
      ordenadas = publicaciones.sort((a, b) =>
        a.votos.reduce((acc, v) => acc + v.valor, 0) -
        b.votos.reduce((acc, v) => acc + v.valor, 0)
      );
      break;
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


}
