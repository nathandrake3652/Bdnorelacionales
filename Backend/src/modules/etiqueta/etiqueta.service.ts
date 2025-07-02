import { Injectable } from '@nestjs/common';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { UpdateEtiquetaDto } from './dto/update-etiqueta.dto';
import { EtiquetaRepository } from './etiqueta.repository';

@Injectable()
export class EtiquetaService {
  constructor(
     private readonly etiquetaRepository: EtiquetaRepository,
  ) {}
  async create(createEtiquetaDto: CreateEtiquetaDto) {
    return await this.etiquetaRepository.create(createEtiquetaDto);
  
  }

  async findAll() {
    return await this.etiquetaRepository.findAll();
  }
  async FindByNombre(nombre: string) {
    return await this.etiquetaRepository.findByNombre(nombre);
  }

  
}
