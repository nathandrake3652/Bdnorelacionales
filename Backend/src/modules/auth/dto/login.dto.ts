import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, {message: "El correo electrónico debe ser válido."})
    correo: string;
    @IsString({message: "La contraseña debe ser una cadena de texto."})
    @MinLength(8, {message: "La contraseña debe tener al menos 8 caracteres."})
    @IsNotEmpty({message: "La contraseña no puede estar vacía."})
    password: string;
}