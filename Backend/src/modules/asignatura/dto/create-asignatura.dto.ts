import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAsignaturaDto {
    @IsString()
    @IsNotEmpty()
    NRC: string;

    @IsNotEmpty()
    @IsString()
    nombre: string;
    
    @IsOptional()
    @IsString()
    Horario?: string;
    
    @IsNumber()
    @IsOptional()
    Alumnos: number;

    @IsNumber()
    @IsOptional()
    AlumnosTea: number;

    @IsString()
    nivel: string;

    @IsOptional()
    @IsArray()
    @Type(() => String)
    profesores?: string[];

}