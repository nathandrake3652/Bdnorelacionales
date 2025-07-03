import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { VotarDto } from './dto/votar.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('publicacion')
export class PublicacionController {
  constructor(private readonly publicacionService: PublicacionService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
    {name: 'imagenes',maxCount: 5},
    {name: 'videoUrl',maxCount: 1},
  ])
)
 async  crearPublicacion(
  @UploadedFiles() files: { imagenes?: Express.Multer.File[], videoUrl?: Express.Multer.File[] },
  
  @Body() body:any) {

    return this.publicacionService.crearConMultimedia(body, files);
  }

  @Get()
  findAll() {
    return this.publicacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionService.remove(id);
  }
  
@Get('usuario/:id')
async publicacionesDeUsuario(@Param('id') id: string) {
  return this.publicacionService.getPorUsuario(id);
}
@Get('filtroetiqueta')
async publicacionesPorEtiquetaYFiltro(
  @Query('etiqueta') etiqueta: string,
  @Query('filtro') filtro: string,
) {
  console.log('Etiqueta:', etiqueta);
  console.log('Filtro:', filtro);
  return this.publicacionService.getFiltro(etiqueta, filtro);
}

@Patch('votar')
async votarPublicacion(@Body() votarDto: VotarDto) {
  return this.publicacionService.votar(votarDto);


}
}
