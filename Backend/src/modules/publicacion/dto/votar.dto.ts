import { IsMongoId, IsNumber } from "class-validator";



export class VotarDto {
    @IsMongoId({ message: 'El ID de la publicación debe ser un ObjectId válido.' })
    idPublicacion: string;
    @IsMongoId({ message: 'El ID del votador debe ser un ObjectId válido.' })
    idVotador: string;
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'El puntaje debe ser un número válido.' })
    score: number;
}