import { Module } from '@nestjs/common';
import { EtiquetaService } from './etiqueta.service';
import { EtiquetaController } from './etiqueta.controller';

@Module({
  controllers: [EtiquetaController],
  providers: [EtiquetaService],
})
export class EtiquetaModule {}
