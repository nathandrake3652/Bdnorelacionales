import { IsUUID } from 'class-validator';

export class AgregarProfesorDto {
  @IsUUID()
  profesorId: string;
}