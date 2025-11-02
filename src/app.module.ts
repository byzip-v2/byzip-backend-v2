import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { BugReportsModule } from './bug-reports/bug-reports.module';
import { DatabaseModule } from './database/database.mobule';
import { UsersModel } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';

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
    BugReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
