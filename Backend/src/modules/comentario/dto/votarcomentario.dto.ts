import { IsMongoId, IsNumber } from 'class-validator';

export class VotarComentarioDto {
  @IsMongoId({ message: 'El ID del comentario debe ser un ObjectId válido.' })
  comentarioId: string;

  @IsMongoId({ message: 'El ID del votador debe ser un ObjectId válido.' })
  votadorId: string;

  @IsNumber({}, { message: 'El score debe ser un número entero (1 o -1).' })
  score: number;
}