import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Asignatura } from './entities/asignatura.entity';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { HorarioAsignaturaDto } from './dto/horario-asignatura.dto';
@Injectable()
export class AsignaturaService {
    constructor(
        @InjectRepository(Asignatura)
        private readonly asignaturarepository: Repository<Asignatura> // Inject your repository here
    ) {}

    async getAsignaturas(){
        return await  this.asignaturarepository.find(); // Fetch all asignaturas from the database
    }
 
    async createAsignatura(CreateAsignaturaDto: CreateAsignaturaDto) {
        return await this.asignaturarepository.save(CreateAsignaturaDto); // Save a new asignatura to the database
    }
    async getbynivel(nivel:Number){
        return this.asignaturarepository.findOneBy({nivel});
    }
    async getbyNRC(NRC:String){
        return this.asignaturarepository.findOneBy({NRC});
    }
    async getbyNombre(nombre:String){
        return this.asignaturarepository.findOneBy({nombre});
    }
    async getbyHorario(Horario:String){
        return this.asignaturarepository.findOneBy({Horario}); 
    }
    async actualizarHorario(nrc: string, dto: HorarioAsignaturaDto): Promise<Asignatura> {
        const asignatura = await this.asignaturarepository.findOne({ where: { NRC: nrc } });
        
        if (!asignatura) {
          throw new NotFoundException('Asignatura no encontrada');
        }
      
        asignatura.Horario = dto.horario;
        return this.asignaturarepository.save(asignatura);
      }

      

}
