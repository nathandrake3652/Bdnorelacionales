import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type EtiquetaDocument = Etiqueta & Document;

@Schema()
export class Etiqueta {
    @Prop({ required: true, unique: true })
    nombre: string;
    
   
    }

export const EtiquetaSchema = SchemaFactory.createForClass(Etiqueta);