import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsRut } from "src/decorators/rut-validator.decorator";
import { Transform } from "class-transformer";

export class RegistroDto {
    @IsString({ message: "El RUT debe ser una cadena de texto." })
    @IsRut({ message: "El RUT no es válido." })
    @IsNotEmpty({ message: "El RUT no puede estar vacío." })
    rut: string;

    @IsString({ message: "El correo debe ser una cadena de texto." })
    @IsNotEmpty({ message: "El correo no puede estar vacío." })
    @IsEmail({}, { message: "El correo no es válido." })
    correo: string;

    @IsString({ message: "El nombre debe ser una cadena de texto." })
    @IsNotEmpty({ message: "El nombre no puede estar vacío." })
    name: string;

    @Transform(({ value }) => value.trim())
    @IsString({ message: "La contraseña debe ser una cadena de texto." })
    @IsNotEmpty({ message: "La contraseña no puede estar vacía." })
    password: string;
}   