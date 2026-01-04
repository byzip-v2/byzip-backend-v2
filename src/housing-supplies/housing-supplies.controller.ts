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
import {
  CreateHousingSupplyDto,
  CreateHousingSupplyResponseDto,
  DeleteHousingSupplyResponseDto,
  GetHousingSupplyResponseDto,
  GetHousingSuppliesQueryDto,
  GetHousingSuppliesResponseDto,
  UpdateHousingSupplyDto,
  UpdateHousingSupplyResponseDto,
} from '../types/dto/housing-supply/housing-supply.dto';
import { HousingSuppliesService } from './housing-supplies.service';

@ApiTags('Housing Supplies')
@Controller('housing-supplies')
export class HousingSuppliesController {
  constructor(
    private readonly housingSuppliesService: HousingSuppliesService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '주택 공급 정보 생성',
    description: '새로운 주택 공급 정보를 생성합니다. (관리자용)',
  })
  @ApiResponse({
    status: 201,
    description: '주택 공급 정보 생성 성공',
    type: CreateHousingSupplyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async create(
    @Body() createHousingSupplyDto: CreateHousingSupplyDto,
  ): Promise<CreateHousingSupplyResponseDto> {
    return await this.housingSuppliesService.create(createHousingSupplyDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '주택 공급 정보 목록 조회',
    description:
      '검색, 필터링, 페이징, 정렬 기능을 지원하는 주택 공급 정보 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '검색어 (주택명, 주소, 공고번호)',
    type: String,
  })
  @ApiQuery({
    name: 'houseSecd',
    required: false,
    description: '주택구분코드 필터 (01: APT, 09: 민간사전청약, 10: 신혼희망타운)',
    type: String,
  })
  @ApiQuery({
    name: 'houseSecdNm',
    required: false,
    description: '주택구분코드명 필터',
    type: String,
  })
  @ApiQuery({
    name: 'houseDtlSecd',
    required: false,
    description: '주택상세구분코드 필터 (01: 민영, 03: 국민)',
    type: String,
  })
  @ApiQuery({
    name: 'rentSecd',
    required: false,
    description: '분양구분코드 필터 (0: 분양주택, 1: 분양전환 가능임대)',
    type: String,
  })
  @ApiQuery({
    name: 'subscrptAreaCodeNm',
    required: false,
    description: '공급지역명 필터',
    type: String,
  })
  @ApiQuery({
    name: 'rcritPblancDeFrom',
    required: false,
    description: '공고일 시작일 (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'rcritPblancDeTo',
    required: false,
    description: '공고일 종료일 (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'rceptBgndeFrom',
    required: false,
    description: '청약접수시작일 시작일 (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'rceptBgndeTo',
    required: false,
    description: '청약접수시작일 종료일 (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'parcprcUlsAt',
    required: false,
    description: '분양가상한제 필터 (Y/N)',
    type: String,
  })
  @ApiQuery({
    name: 'specltRdnEarthAt',
    required: false,
    description: '투기과열지구 필터 (Y/N)',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 항목 수',
    type: Number,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: '정렬 기준 필드',
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: '정렬 순서 (ASC 또는 DESC)',
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({
    status: 200,
    description: '주택 공급 정보 목록 조회 성공',
    type: GetHousingSuppliesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async findAll(
    @Query() query: GetHousingSuppliesQueryDto,
  ): Promise<GetHousingSuppliesResponseDto> {
    return await this.housingSuppliesService.findAll(query);
  }

  @Get('missing-coordinates')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '좌표가 없는 주택 공급 정보 조회',
    description:
      'latitude 또는 longitude 중 하나라도 null인 주택 공급 정보 목록을 조회합니다. (지오코딩 실패한 항목 조회용)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '검색어 (주택명, 주소, 공고번호)',
    type: String,
  })
  @ApiQuery({
    name: 'houseSecd',
    required: false,
    description: '주택구분코드 필터 (01: APT, 09: 민간사전청약, 10: 신혼희망타운)',
    type: String,
  })
  @ApiQuery({
    name: 'houseSecdNm',
    required: false,
    description: '주택구분코드명 필터',
    type: String,
  })
  @ApiQuery({
    name: 'houseDtlSecd',
    required: false,
    description: '주택상세구분코드 필터 (01: 민영, 03: 국민)',
    type: String,
  })
  @ApiQuery({
    name: 'rentSecd',
    required: false,
    description: '분양구분코드 필터 (0: 분양주택, 1: 분양전환 가능임대)',
    type: String,
  })
  @ApiQuery({
    name: 'subscrptAreaCodeNm',
    required: false,
    description: '공급지역명 필터',
    type: String,
  })
  @ApiQuery({
    name: 'rcritPblancDeFrom',
    required: false,
    description: '공고일 시작일 (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'rcritPblancDeTo',
    required: false,
    description: '공고일 종료일 (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'rceptBgndeFrom',
    required: false,
    description: '청약접수시작일 시작일 (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'rceptBgndeTo',
    required: false,
    description: '청약접수시작일 종료일 (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'parcprcUlsAt',
    required: false,
    description: '분양가상한제 필터 (Y/N)',
    type: String,
  })
  @ApiQuery({
    name: 'specltRdnEarthAt',
    required: false,
    description: '투기과열지구 필터 (Y/N)',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 항목 수',
    type: Number,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: '정렬 기준 필드',
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: '정렬 순서 (ASC 또는 DESC)',
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({
    status: 200,
    description: '좌표가 없는 주택 공급 정보 목록 조회 성공',
    type: GetHousingSuppliesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async findMissingCoordinates(
    @Query() query: GetHousingSuppliesQueryDto,
  ): Promise<GetHousingSuppliesResponseDto> {
    return await this.housingSuppliesService.findMissingCoordinates(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '특정 주택 공급 정보 조회',
    description: 'ID로 특정 주택 공급 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '주택 공급 정보 ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: '주택 공급 정보 조회 성공',
    type: GetHousingSupplyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '주택 공급 정보를 찾을 수 없음',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async findOne(
    @Param('id') id: number,
  ): Promise<GetHousingSupplyResponseDto> {
    return await this.housingSuppliesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '주택 공급 정보 업데이트',
    description: '주택 공급 정보를 업데이트합니다. (관리자용)',
  })
  @ApiParam({ name: 'id', description: '주택 공급 정보 ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: '주택 공급 정보 업데이트 성공',
    type: UpdateHousingSupplyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '주택 공급 정보를 찾을 수 없음',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async update(
    @Param('id') id: number,
    @Body() updateHousingSupplyDto: UpdateHousingSupplyDto,
  ): Promise<UpdateHousingSupplyResponseDto> {
    return await this.housingSuppliesService.update(id, updateHousingSupplyDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '주택 공급 정보 삭제',
    description: '주택 공급 정보를 삭제합니다. (관리자용)',
  })
  @ApiParam({ name: 'id', description: '주택 공급 정보 ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: '주택 공급 정보 삭제 성공',
    type: DeleteHousingSupplyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '주택 공급 정보를 찾을 수 없음',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  async remove(
    @Param('id') id: number,
  ): Promise<DeleteHousingSupplyResponseDto> {
    return await this.housingSuppliesService.remove(id);
  }
}

