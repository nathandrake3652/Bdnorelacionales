import { Injectable } from '@nestjs/common';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';
import { PremioRepository } from './premio.repository';

@Injectable()
export class PremioService {
  constructor(
     private readonly premioRepository: PremioRepository, 
  ) {}
  create(createPremioDto: CreatePremioDto) {
    return this.premioRepository.create(createPremioDto);
    
  }

  findAll() {
    return this.premioRepository.findAll();
    
  }

  findOne(id: number) {
    return this.premioRepository.findById(id.toString());
  }

  
}
