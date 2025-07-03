import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { VotarDto } from './dto/votar.dto';

@Controller('publicacion')
export class PublicacionController {
  constructor(private readonly publicacionService: PublicacionService) {}

  @Post()
  create(@Body() createPublicacionDto: CreatePublicacionDto) {
    return this.publicacionService.create(createPublicacionDto);
  }

  @Get()
  findAll() {
    return this.publicacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacionDto: UpdatePublicacionDto) {
    return this.publicacionService.update(+id, updatePublicacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionService.remove(id);
  }
  @Get('filtrar/:tipo')
  async filtrarPorTipo(@Param('tipo') tipo: string) {
  return this.publicacionService.getPublicacionesporfiltro(tipo);
}
@Get('usuario/:id')
async publicacionesDeUsuario(@Param('id') id: string) {
  return this.publicacionService.getPorUsuario(id);
}
@Get('filtroetiqueta/:etiqueta/:filtro')
async publicacionesPorEtiquetaYFiltro(
  @Param('etiqueta') etiqueta: string,
  @Param('filtro') filtro: string,
) {
  return this.publicacionService.getPorEtiquetaYFiltro(etiqueta, filtro);
}
@Patch('votar')
async votarPublicacion(@Body() votarDto: VotarDto) {
  return this.publicacionService.votar(votarDto);


}
}
