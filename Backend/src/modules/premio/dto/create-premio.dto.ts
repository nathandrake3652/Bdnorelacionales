import { IsString } from "class-validator";

export class CreatePremioDto {
    @IsString({ message: 'El nombre del premio debe ser una cadena de texto.' })
    name: string;
    
    @IsString({ message: 'El coste del premio debe ser un número.' })
    coste: number;
}
