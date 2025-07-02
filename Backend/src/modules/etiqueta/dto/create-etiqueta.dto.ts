import { IsString } from "class-validator";

export class CreateEtiquetaDto {

    @IsString({ message: 'El nombre de la etiqueta debe ser una cadena de texto.' })
    nombre: string;
  
  
}
