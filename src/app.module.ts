import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.mobule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역에서 사용 가능하도록 설정
      envFilePath: [
        '.env.local', // 최우선 (개발자 개인 설정)
        `.env.${process.env.NODE_ENV}`, // 환경별 설정
      ],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UsersModel]), // AppService에서 UsersModel 사용
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
