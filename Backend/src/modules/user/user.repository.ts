import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/user.schema';


@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<Usuario>,
  ) {}

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const user = new this.usuarioModel(data);
    return user.save();
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ correo }).exec();
  }

  async findById(id: string): Promise<UsuarioDocument> {
    const user =  await this.usuarioModel.findById(id).exec();
    if (!user) {
      throw new Error('Usuario no encontrado'); // Si no se encuentra el usuario, retorna null
    }
    return user;
  }

  async blockUser(userId: string, blockedId: string): Promise<void> {
    await this.usuarioModel.findByIdAndUpdate(userId, {
      $addToSet: { bloqueados: blockedId },
    });
  }
}