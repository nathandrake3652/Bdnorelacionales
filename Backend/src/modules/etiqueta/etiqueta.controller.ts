import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EtiquetaService } from './etiqueta.service';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { UpdateEtiquetaDto } from './dto/update-etiqueta.dto';

@Controller('etiqueta')
export class EtiquetaController {
  constructor(private readonly etiquetaService: EtiquetaService) {}

  @Post()
  create(@Body() createEtiquetaDto: CreateEtiquetaDto) {
    return this.etiquetaService.create(createEtiquetaDto);
  }

  @Get()
  findAll() {
    return this.etiquetaService.findAll();
  }

  
}
