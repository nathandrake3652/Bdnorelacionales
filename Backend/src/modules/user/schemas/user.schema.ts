import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {
  @Prop({ required: true, unique: true })
  correo: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  bloqueados: Types.ObjectId[];

  @Prop({ enum: ['admin', 'anon', 'registered'], default: 'registered' })
  type: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);