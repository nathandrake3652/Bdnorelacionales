import { Inject, Injectable } from "@nestjs/common";
import { Publicacion, PublicacionDocument } from "./schemas/publicacion.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class publicacionRepository {

    constructor(
        @Inject(Publicacion.name) // Asegúrate de que este token esté definido en tu módulo
        private readonly publicacionModel: Model<Publicacion>
    ) {
        
    }
    async create(data: Partial<Publicacion>): Promise<Publicacion> {
        const publicacion = new this.publicacionModel(data);
        return publicacion.save();
    }
    async findAll(): Promise<PublicacionDocument[]> {
        return this.publicacionModel.find().exec();
    }
    async findById(id: string): Promise<Publicacion | null> {
        return this.publicacionModel.findById(id).exec();
    }
    async findByAuthor(authorId: string): Promise<PublicacionDocument[]> {
        return this.publicacionModel.find({ "author.id": authorId }).exec();
    }
    async findByTag(tag: string): Promise<Publicacion[]> {
        return this.publicacionModel.find({ tags: tag }).exec();
    }
    async deletebyId(id: string): Promise<Publicacion | null> {
        return this.publicacionModel.findByIdAndDelete(id).exec();
    }
    async updateVotosArray(publicacionId: string, votos: { userId: Types.ObjectId; valor: number }[]): Promise<PublicacionDocument | null> {
    
    return this.publicacionModel.findByIdAndUpdate(
    publicacionId,
    { votos },
    { new: true },
  ).exec();
}
async findByEtiqueta(etiqueta: string): Promise<PublicacionDocument[]> {
  return this.publicacionModel.find({ tags: etiqueta }).exec();
}
async deleteById(id: string): Promise<PublicacionDocument | null> {
    return this.publicacionModel.findByIdAndDelete(id).exec();

}

}