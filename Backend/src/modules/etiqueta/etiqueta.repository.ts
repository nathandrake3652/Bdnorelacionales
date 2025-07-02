import { Injectable } from "@nestjs/common";
import { CreateEtiquetaDto } from "./dto/create-etiqueta.dto";
import { Etiqueta } from "./schemas/etiqueta.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class EtiquetaRepository {
    constructor(
        @InjectModel(Etiqueta.name)
        private readonly etiquetaModel: Model<Etiqueta>,
    ) {}

    async create(data: CreateEtiquetaDto): Promise<Etiqueta> {
        const etiqueta = new this.etiquetaModel(data);
        return etiqueta.save();
    }

    async findAll(): Promise<any[]> {
        const etiquetas = await this.etiquetaModel.find().exec();
        if (!etiquetas || etiquetas.length === 0) {
            return []; // Retorna un array vacío si no hay etiquetas
        }
        return etiquetas; // Placeholder
    }

    async findById(id: string): Promise<any | null> {
        // Implementa la lógica para encontrar una etiqueta por ID
        return null; // Placeholder
    }

    async deleteById(id: string): Promise<any | null> {
        // Implementa la lógica para eliminar una etiqueta por ID
        return null; // Placeholder
    }
}