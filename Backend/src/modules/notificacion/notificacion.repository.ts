import { Injectable } from "@nestjs/common";
import { Notificacion } from "./schemas/notificacion.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class NotificacionRepository {
    constructor(
        @InjectModel(Notificacion.name)
        private readonly notificacionModel: Model<Notificacion>
    ) {
        // Aquí podrías inyectar un modelo de Mongoose si es necesario
    }
    

    async create(data: Partial<Notificacion>): Promise<Notificacion> {
    const notificacion = new this.notificacionModel(data);
    return notificacion.save();
  }

    async findByUsuarioDestino(userId: string): Promise<Notificacion[]> {
    return this.notificacionModel
      .find({ usuarioDestino: new Types.ObjectId(userId) })
      .sort({ fecha: -1 })
      .exec();
  }

    
  async findById(id: string): Promise<Notificacion | null> {
    return this.notificacionModel.findById(id).exec();
  }

    async deleteById(id: string): Promise<any | null> {
        // Implementa la lógica para eliminar una notificación por ID
        return null; // Placeholder
    }
}

