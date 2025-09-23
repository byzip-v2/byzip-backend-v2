import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UsersModel } from './users/entities/users.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private readonly dataSource: DataSource,
  ) {}

  async getHealthCheck(): Promise<{ status: string; database: string }> {
    try {
      // 데이터베이스 연결 테스트
      await this.dataSource.query('SELECT 1');
      return {
        status: 'OK',
        database: 'Connected to Neon PostgreSQL',
      };
    } catch (error) {
      return {
        status: 'ERROR',
        database: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
