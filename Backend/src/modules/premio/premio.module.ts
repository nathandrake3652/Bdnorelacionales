import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PremioService } from './premio.service';
import { PremioController } from './premio.controller';
import { Premio, PremioSchema } from './schemas/premio.schema';
import { PremioRepository } from './premio.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Premio.name, schema: PremioSchema }])],
  providers: [PremioService,PremioRepository],
  controllers: [PremioController],
  exports: [PremioService, PremioRepository] // Exportamos el servicio y el repositorio para que puedan ser utilizados en otros módulos
})
export class PremioModule {}