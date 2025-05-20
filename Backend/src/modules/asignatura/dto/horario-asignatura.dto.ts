import { IsString } from 'class-validator';

export class HorarioAsignaturaDto {
  @IsString()
  horario: string;
}