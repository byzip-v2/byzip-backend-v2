import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateBugReportDto,
  CreateBugReportResponseDto,
  DeleteBugReportResponseDto,
  GetBugReportResponseDto,
  GetBugReportsQueryDto,
  GetBugReportsResponseDto,
  UpdateBugReportDto,
  UpdateBugReportResponseDto,
} from '../types/dto/bug-report/bug-report.dto';
import { BugReportsService } from './bug-reports.service';

@ApiTags('Bug Reports')
@Controller('bug-reports')
export class BugReportsController {
  constructor(private readonly bugReportsService: BugReportsService) {}

  @Post()
  @Public() // 클라이언트에서 인증 없이 버그 리포트 가능
  @ApiOperation({
    summary: '버그 리포트 생성',
    description: '클라이언트에서 발생한 버그를 리포트합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '버그 리포트 생성 성공',
    type: CreateBugReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  async create(
    @Body() createBugReportDto: CreateBugReportDto,
  ): Promise<CreateBugReportResponseDto> {
    return await this.bugReportsService.create(createBugReportDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '버그 리포트 목록 조회',
    description:
      '검색, 필터링, 페이징, 정렬 기능을 지원하는 버그 리포트 목록을 조회합니다. (관리자용)',
  })
  @ApiResponse({
    status: 200,
    description: '버그 리포트 목록 조회 성공',
    type: GetBugReportsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async findAll(
    @Query() query: GetBugReportsQueryDto,
  ): Promise<GetBugReportsResponseDto> {
    return await this.bugReportsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '특정 버그 리포트 조회',
    description: 'ID로 특정 버그 리포트를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '버그 리포트 ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: '버그 리포트 조회 성공',
    type: GetBugReportResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '버그 리포트를 찾을 수 없음',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async findOne(@Param('id') id: number): Promise<GetBugReportResponseDto> {
    return await this.bugReportsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '버그 리포트 업데이트',
    description: '버그 리포트의 상태나 내용을 업데이트합니다. (관리자용)',
  })
  @ApiParam({ name: 'id', description: '버그 리포트 ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: '버그 리포트 업데이트 성공',
    type: UpdateBugReportResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '버그 리포트를 찾을 수 없음',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async update(
    @Param('id') id: number,
    @Body() updateBugReportDto: UpdateBugReportDto,
  ): Promise<UpdateBugReportResponseDto> {
    return await this.bugReportsService.update(id, updateBugReportDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '버그 리포트 삭제',
    description: '버그 리포트를 삭제합니다. (관리자용)',
  })
  @ApiParam({ name: 'id', description: '버그 리포트 ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: '버그 리포트 삭제 성공',
    type: DeleteBugReportResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '버그 리포트를 찾을 수 없음',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async remove(@Param('id') id: number): Promise<DeleteBugReportResponseDto> {
    return await this.bugReportsService.remove(id);
  }
}
