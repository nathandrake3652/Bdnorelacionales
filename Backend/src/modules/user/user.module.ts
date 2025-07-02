import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schemas/user.schema';
import { UsuarioService } from './user.service';
import { UserController } from './user.controller';
import { UsuarioRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  controllers: [UserController],
  providers: [UsuarioService,UsuarioRepository],
  exports: [UsuarioService],
})
export class UserModule {}