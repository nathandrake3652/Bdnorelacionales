import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { VotarComentarioDto } from './dto/votarcomentario.dto';

@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {}

  @Post()
  create(@Body() createComentarioDto: CreateComentarioDto) {
    return this.comentarioService.crearComentario(createComentarioDto);
  }

  @Get()
  async obtenerComentarios(
  @Query('publicacionId') publicacionId: string,
  @Query('filtro') filtro: 'Publicacion' | 'Comentario',
) {
  return this.comentarioService.obtenerComentariosPorFiltro(publicacionId, filtro);
}
@Patch('votar')
votar( @Body() dto: VotarComentarioDto) {
  return this.comentarioService.votarEnComentario(dto);
}

@Get('usuario/:id')
async comentariosDeUsuario(@Param('id') id: string) {
  return this.comentarioService.obtenerComentariosPorUsuario(id);
}
@Delete(':id')
async eliminarComentario(@Param('id') id: string) {
  return this.comentarioService.eliminarComentario(id);
}

}