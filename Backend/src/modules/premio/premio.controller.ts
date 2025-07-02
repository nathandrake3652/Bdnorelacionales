import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PremioService } from './premio.service';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';

@Controller('premio')
export class PremioController {
  constructor(private readonly premioService: PremioService) {}

  @Post()
  create(@Body() createPremioDto: CreatePremioDto) {
    return this.premioService.create(createPremioDto);
  }

  @Get()
  findAll() {
    return this.premioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.premioService.findOne(+id);
  }

  
}
