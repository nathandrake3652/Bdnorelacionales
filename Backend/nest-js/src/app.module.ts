import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'admin',
    password: '12345',
    database: 'db_crud',
    autoLoadEntities: true,
    synchronize: true,
  }),
  ]
})
export class AppModule {}
