import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PublicacionDocument = Publicacion & Document;

@Schema()
export class Publicacion {
  @Prop({ required: true })
  title: string;

  @Prop([{
    type: {
      type: String,
      enum: ['image', 'gif', 'video', 'link', 'text'],
      required: true,
    },
    content: { type: String, required: true },
  }])
  media: { type: string; content: string }[];

  @Prop({
    type: {
      id: { type: Types.ObjectId, ref: 'Usuario' },
      username: String,
    },
    required: true,
  })
  author: {
    id: Types.ObjectId;
    username: string;
  };

  @Prop([String])
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop([{
    userId: { type: Types.ObjectId, ref: 'Usuario' },
    valor: Number,
  }])
  votos: {
    userId: Types.ObjectId;
    valor: number;
  }[];

  @Prop([{
    id: { type: Types.ObjectId, ref: 'Premio' },
    numero: Number,
  }])
  premios: {
    id: Types.ObjectId;
    numero: number;
  }[];
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);