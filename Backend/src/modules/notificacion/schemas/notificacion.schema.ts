import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificacionDocument = Notificacion & Document;

@Schema()
export class Notificacion {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioDestino: Types.ObjectId;

  @Prop({ enum: ['comentario', 'respuesta', 'voto', 'premio'], required: true })
  tipo: string;

  @Prop({
    type: {
      usuarioId: { type: Types.ObjectId, ref: 'Usuario' },
      username: String,
    },
    required: true,
  })
  origen: {
    usuarioId: Types.ObjectId;
    username: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'Publicacion' })
  postId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comentario' })
  comentarioId?: Types.ObjectId;

  @Prop()
  mensaje: string;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);