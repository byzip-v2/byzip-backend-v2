import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateBugReportDto,
  CreateBugReportResponseDto,
  DeleteBugReportResponseDto,
  GetBugReportResponseDto,
  GetBugReportsResponseDto,
  UpdateBugReportDto,
  UpdateBugReportResponseDto,
} from '../types/dto/bug-report/bug-report.dto';
import { BugReport } from './entities/bug-report.entity';

@Injectable()
export class BugReportsService {
  private readonly logger = new Logger(BugReportsService.name);

  constructor(
    @InjectRepository(BugReport)
    private readonly bugReportRepository: Repository<BugReport>,
  ) {}

  // 버그 리포트 생성
  async create(
    createBugReportDto: CreateBugReportDto,
  ): Promise<CreateBugReportResponseDto> {
    this.logger.log(
      `새로운 버그 리포트 생성: ${JSON.stringify(createBugReportDto)}`,
    );

    const bugReport = this.bugReportRepository.create(createBugReportDto);
    const savedReport = await this.bugReportRepository.save(bugReport);

    return {
      success: true,
      message: '버그 리포트가 성공적으로 등록되었습니다.',
      data: savedReport,
    };
  }

  // 모든 버그 리포트 조회
  async findAll(): Promise<GetBugReportsResponseDto> {
    this.logger.log('모든 버그 리포트 조회');

    const bugReports = await this.bugReportRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      success: true,
      message: '버그 리포트 목록을 성공적으로 조회했습니다.',
      data: bugReports,
    };
  }

  // 특정 버그 리포트 조회
  async findOne(id: number): Promise<GetBugReportResponseDto> {
    this.logger.log(`버그 리포트 조회: ID=${id}`);

    const bugReport = await this.bugReportRepository.findOne({
      where: { id },
    });

    if (!bugReport) {
      throw new NotFoundException('버그 리포트를 찾을 수 없습니다.');
    }

    return {
      success: true,
      message: '버그 리포트를 성공적으로 조회했습니다.',
      data: bugReport,
    };
  }

  // 특정 사용자의 버그 리포트 조회
  async findByUserId(userId: string): Promise<GetBugReportsResponseDto> {
    this.logger.log(`사용자별 버그 리포트 조회: userId=${userId}`);

    const bugReports = await this.bugReportRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      success: true,
      message: '사용자의 버그 리포트 목록을 성공적으로 조회했습니다.',
      data: bugReports,
    };
  }

  // 버그 리포트 업데이트
  async update(
    id: number,
    updateBugReportDto: UpdateBugReportDto,
  ): Promise<UpdateBugReportResponseDto> {
    this.logger.log(
      `버그 리포트 업데이트: ID=${id}, 데이터=${JSON.stringify(updateBugReportDto)}`,
    );

    const bugReport = await this.bugReportRepository.findOne({
      where: { id },
    });

    if (!bugReport) {
      throw new NotFoundException('버그 리포트를 찾을 수 없습니다.');
    }

    // 업데이트 실행
    await this.bugReportRepository.update(id, updateBugReportDto);

    // 업데이트된 버그 리포트 조회
    const updatedReport = await this.bugReportRepository.findOne({
      where: { id },
    });

    return {
      success: true,
      message: '버그 리포트가 성공적으로 업데이트되었습니다.',
      data: updatedReport!,
    };
  }

  // 버그 리포트 삭제
  async remove(id: number): Promise<DeleteBugReportResponseDto> {
    this.logger.log(`버그 리포트 삭제: ID=${id}`);

    const bugReport = await this.bugReportRepository.findOne({
      where: { id },
    });

    if (!bugReport) {
      throw new NotFoundException('버그 리포트를 찾을 수 없습니다.');
    }

    await this.bugReportRepository.delete(id);

    return {
      success: true,
      message: '버그 리포트가 성공적으로 삭제되었습니다.',
    };
  }
}

