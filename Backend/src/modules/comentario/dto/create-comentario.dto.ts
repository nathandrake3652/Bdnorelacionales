import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateComentarioDto {
  @IsString({ message: 'El contenido del comentario debe ser un texto.' })
  content: string;

  @IsMongoId({ message: 'El ID del autor debe ser un ObjectId válido.' })
  authorId: string;



  @IsMongoId({ message: 'El ID de la publicación debe ser un ObjectId válido.' })
  publicacionId: string;

  @IsMongoId({ message: 'El ID del comentario padre debe ser un ObjectId válido.' })
  @IsOptional()
  parentCommentId?: string;
}