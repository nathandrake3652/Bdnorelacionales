import { Module } from '@nestjs/common';
import { EtiquetaService } from './etiqueta.service';
import { EtiquetaController } from './etiqueta.controller';
import { EtiquetaRepository } from './etiqueta.repository';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Etiqueta, EtiquetaSchema } from './schemas/etiqueta.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Etiqueta.name, schema: EtiquetaSchema }]),
  ],
  controllers: [EtiquetaController],
  providers: [EtiquetaService,EtiquetaRepository],
})
export class EtiquetaModule {}
