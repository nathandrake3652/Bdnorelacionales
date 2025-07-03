import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { Comentario } from './schemas/comentario.schema';


@Injectable()
export class ComentarioRepository {
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<Comentario>,
  ) {}

  async create(data: Partial<Comentario>): Promise<Comentario> {
    const comentario = new this.comentarioModel(data);
    return comentario.save();
  }

  async findByPublicacion(publicacionId: string): Promise<ComentarioPlano[]> {
    return this.comentarioModel
      .find({ 'publicacion.id': publicacionId })
      .populate('author.id', 'username')
      .lean()
      .exec();
  }

  async findById(id: string): Promise<Comentario | null> {
    return this.comentarioModel.findById(id).exec();
  }
  async updateVotosArray(
    comentarioId: string,
    votos: { userId: Types.ObjectId; valor: number }[],
  ): Promise<Comentario | null> {
    return this.comentarioModel
      .findByIdAndUpdate(
        comentarioId,
        { votos },
        { new: true },
      )
      .exec();
  }
  async findByUsuarioId(usuarioId: string): Promise<Comentario[]> {
  return this.comentarioModel
    .find({ 'author.id': usuarioId })
    .populate('publicacion.id', 'title') // opcional, si quieres el título de la publicación
    .lean()
    .exec();
}

}

export interface ComentarioPlano {
  _id: Types.ObjectId | string;
  content: string;
  score: number;
  author: {
    id: Types.ObjectId | string | { _id: string; username: string };
    username: string;
  };
  publicacion: {
    id: Types.ObjectId | string;
  };
  parentCommentId?: Types.ObjectId | string;
  replies?: ComentarioPlano[];
}