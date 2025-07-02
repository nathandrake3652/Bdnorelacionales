import { IsMongoId, IsString } from 'class-validator';

export class AsignarPremioDto {
  @IsMongoId()
  publicacionId: string;

  @IsString()
  nombrePremio: string;

  @IsMongoId()
  usuarioId: string; 
}