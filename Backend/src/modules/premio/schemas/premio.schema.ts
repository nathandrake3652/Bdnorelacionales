import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PremioDocument = Premio & Document;

@Schema()
export class Premio {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  coste: number;
}

export const PremioSchema = SchemaFactory.createForClass(Premio);