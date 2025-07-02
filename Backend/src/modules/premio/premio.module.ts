import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PremioService } from './premio.service';
import { PremioController } from './premio.controller';
import { Premio, PremioSchema } from './schemas/premio.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Premio.name, schema: PremioSchema }])],
  providers: [PremioService],
  controllers: [PremioController],
})
export class PremioModule {}