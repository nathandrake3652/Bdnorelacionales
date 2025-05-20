import { Module } from '@nestjs/common';
import { AsignaturaService } from './asignatura.service';
import { AsignaturaController } from './asignatura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from './entities/asignatura.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Asignatura])], // Import TypeOrmModule with your entities if needed
    controllers: [AsignaturaController],
    providers: [AsignaturaService],
    exports: [], // Export any providers or modules if needed


})
export class AsignaturaModule {


}
