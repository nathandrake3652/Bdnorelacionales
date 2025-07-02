import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ComentarioModule } from './modules/comentario/comentario.module';
import { NotificacionModule } from './modules/notificacion/notificacion.module';
import { PremioModule } from './modules/premio/premio.module';
import { PublicacionModule } from './modules/publicacion/publicacion.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { EtiquetaModule } from './modules/etiqueta/etiqueta.module';


function getEnvValue(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return value;
}

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore as any,
        host: 'localhost',
        port: 6379,
        ttl: 60 * 60 * 24, // la informacion del cache se guarda por 24 horas
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `mongodb://${getEnvValue('DATABASE_USERNAME')}:${getEnvValue('DATABASE_PASSWORD')}@${getEnvValue('DATABASE_HOST')}:${getEnvValue('DATABASE_PORT')}`,
        dbName: getEnvValue('DATABASE_NAME'),
      }),
    }),

    UserModule,
    AuthModule,
    PremioModule,
    ComentarioModule,
    PublicacionModule,
    NotificacionModule,
    EtiquetaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}