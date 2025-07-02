import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComentarioDocument = Comentario & Document;

@Schema()
export class Comentario {
  @Prop({ required: true })
  content: string;

 @Prop({ default: 0 }) 
  score: number;

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

  @Prop({
    type: {
      id: { type: Types.ObjectId, ref: 'Publicacion' },
    },
    required: true,
  })
  publicacion: {
    id: Types.ObjectId;
  };

  @Prop({ type: Types.ObjectId, ref: 'Comentario', required: false })
  parentCommentId?: Types.ObjectId;
  @Prop([{
    userId: { type: Types.ObjectId, ref: 'Usuario' },
    valor: Number,
  }] )
  votos: {
    userId: Types.ObjectId;
    valor: number;
  }[];

}


export const ComentarioSchema = SchemaFactory.createForClass(Comentario);