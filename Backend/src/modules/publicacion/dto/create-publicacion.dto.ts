import { Type } from "class-transformer";
import { IsArray, IsIn, IsMongoId, IsNumber, IsString, ValidateNested } from "class-validator";

class MediaItemDto {
  @IsString()
  @IsIn(['image', 'gif', 'video', 'link', 'text'])
  type: string;

  @IsString()
  content: string;
}

export class CreatePublicacionDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  title: string;

  @IsArray({ message: 'El contenido multimedia debe ser un arreglo.' })
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media: MediaItemDto[];

  @IsMongoId({ message: 'El ID del autor debe ser un ObjectId válido.' })
  authorId: string;

  @IsArray({ message: 'Las etiquetas deben ser un arreglo de cadenas.' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser una cadena de texto.' })
  tags: string[];
}
