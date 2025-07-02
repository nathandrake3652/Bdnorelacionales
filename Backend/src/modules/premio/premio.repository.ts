import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Premio } from "./schemas/premio.schema";
import { Model } from "mongoose";
import { CreatePremioDto } from "./dto/create-premio.dto";

@Injectable()
export class PremioRepository {
    constructor(
         @InjectModel(Premio.name)
        private readonly premioModel: Model<Premio>  // Reemplaza 'any' con el tipo adecuado
    ) {
       
    }

    async create(data: CreatePremioDto): Promise<any> {
        const premio = new this.premioModel(data);
        return premio.save();
    }

    async findAll(): Promise<any[]> {
        const premios = await this.premioModel.find().exec();
        if (!premios || premios.length === 0) {
            return []; // Retorna un array vacío si no hay premios
        }
        return premios; // Placeholder
    }

    async findById(id: string): Promise<any | null> {
        const premio = await this.premioModel.findById(id).exec();
        if (!premio) {
            return null; // Si no se encuentra el premio, retorna null
        }
        return premio; // Placeholder
    }

    async deleteById(id: string): Promise<any | null> {
        // Implementa la lógica para eliminar un premio por ID
        return null; // Placeholder
    }
}