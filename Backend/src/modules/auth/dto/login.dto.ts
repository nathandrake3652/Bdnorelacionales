import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsString({message: "El RUT debe ser una cadena de texto."})
    @IsNotEmpty({message: "El RUT no puede estar vacío."})
    rut: string;
    @IsString({message: "La contraseña debe ser una cadena de texto."})
    @MinLength(8, {message: "La contraseña debe tener al menos 8 caracteres."})
    @IsNotEmpty({message: "La contraseña no puede estar vacía."})
    password: string;
}