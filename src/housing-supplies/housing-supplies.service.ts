import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { HousingSupply } from '../scheduler/entities/housing-supply.entity';

@Injectable()
export class HousingSuppliesService {
  private readonly logger = new Logger(HousingSuppliesService.name);

  constructor(
    @InjectRepository(HousingSupply)
    private readonly housingSupplyRepository: Repository<HousingSupply>,
  ) {}

  // 주택 공급 정보 생성
  async create(
    createHousingSupplyDto: CreateHousingSupplyDto,
  ): Promise<CreateHousingSupplyResponseDto> {
    this.logger.log(
      `새로운 주택 공급 정보 생성: ${JSON.stringify(createHousingSupplyDto)}`,
    );

    const housingSupply = this.housingSupplyRepository.create(
      createHousingSupplyDto,
    );
    const savedSupply = await this.housingSupplyRepository.save(housingSupply);

    return {
      success: true,
      message: '주택 공급 정보가 성공적으로 등록되었습니다.',
      data: savedSupply,
    };
  }

  // 모든 주택 공급 정보 조회 (검색, 필터링, 페이징 지원)
  async findAll(
    query: GetHousingSuppliesQueryDto,
  ): Promise<GetHousingSuppliesResponseDto> {
    this.logger.log(`주택 공급 정보 조회: ${JSON.stringify(query)}`);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'rcritPblancDe';
    const sortOrder = query.sortOrder || 'DESC';

    // QueryBuilder 생성
    const queryBuilder =
      this.housingSupplyRepository.createQueryBuilder('housingSupply');

    // 검색 기능 (주택명, 주소, 공고번호에서 검색)
    if (query.search) {
      queryBuilder.andWhere(
        '(housingSupply.houseName ILIKE :search OR housingSupply.hssplyAdres ILIKE :search OR housingSupply.pblancNo ILIKE :search OR housingSupply.houseManageNo ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // 필터링
    if (query.houseSecd) {
      queryBuilder.andWhere('housingSupply.houseSecd = :houseSecd', {
        houseSecd: query.houseSecd,
      });
    }

    if (query.houseSecdNm) {
      queryBuilder.andWhere('housingSupply.houseSecdNm = :houseSecdNm', {
        houseSecdNm: query.houseSecdNm,
      });
    }

    if (query.houseDtlSecd) {
      queryBuilder.andWhere('housingSupply.houseDtlSecd = :houseDtlSecd', {
        houseDtlSecd: query.houseDtlSecd,
      });
    }

    if (query.rentSecd) {
      queryBuilder.andWhere('housingSupply.rentSecd = :rentSecd', {
        rentSecd: query.rentSecd,
      });
    }

    if (query.subscrptAreaCodeNm) {
      queryBuilder.andWhere(
        'housingSupply.subscrptAreaCodeNm = :subscrptAreaCodeNm',
        {
          subscrptAreaCodeNm: query.subscrptAreaCodeNm,
        },
      );
    }

    // 날짜 범위 필터링
    if (query.rcritPblancDeFrom) {
      queryBuilder.andWhere(
        'housingSupply.rcritPblancDe >= :rcritPblancDeFrom',
        {
          rcritPblancDeFrom: query.rcritPblancDeFrom,
        },
      );
    }

    if (query.rcritPblancDeTo) {
      queryBuilder.andWhere('housingSupply.rcritPblancDe <= :rcritPblancDeTo', {
        rcritPblancDeTo: query.rcritPblancDeTo,
      });
    }

    if (query.rceptBgndeFrom) {
      queryBuilder.andWhere('housingSupply.rceptBgnde >= :rceptBgndeFrom', {
        rceptBgndeFrom: query.rceptBgndeFrom,
      });
    }

    if (query.rceptBgndeTo) {
      queryBuilder.andWhere('housingSupply.rceptBgnde <= :rceptBgndeTo', {
        rceptBgndeTo: query.rceptBgndeTo,
      });
    }

    // 플래그 필터링
    if (query.parcprcUlsAt) {
      queryBuilder.andWhere('housingSupply.parcprcUlsAt = :parcprcUlsAt', {
        parcprcUlsAt: query.parcprcUlsAt,
      });
    }

    if (query.specltRdnEarthAt) {
      queryBuilder.andWhere(
        'housingSupply.specltRdnEarthAt = :specltRdnEarthAt',
        {
          specltRdnEarthAt: query.specltRdnEarthAt,
        },
      );
    }

    // 숨김 여부 필터 (isHidden: true일 때만 숨김 목록 포함, 기본값은 숨김 제외)
    if (query.isHidden !== true) {
      queryBuilder.andWhere('housingSupply.isHidden = :isHidden', {
        isHidden: false,
      });
    }

    // 정렬
    queryBuilder.orderBy(`housingSupply.${sortBy}`, sortOrder);

    // 전체 개수 조회 (필터링 적용)
    const total = await queryBuilder.getCount();

    // 페이징 적용
    queryBuilder.skip(skip).take(limit);

    // 데이터 조회
    const housingSupplies = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: '주택 공급 정보 목록을 성공적으로 조회했습니다.',
      data: housingSupplies,
      meta: {
        page,
        limit,
        total,
        totalPages,
        itemCount: housingSupplies.length,
      },
    };
  }

  // 특정 주택 공급 정보 조회
  async findOne(id: number): Promise<GetHousingSupplyResponseDto> {
    this.logger.log(`주택 공급 정보 조회: ID=${id}`);

    const housingSupply = await this.housingSupplyRepository.findOne({
      where: { id },
    });

    if (!housingSupply) {
      throw new NotFoundException('주택 공급 정보를 찾을 수 없습니다.');
    }

    return {
      success: true,
      message: '주택 공급 정보를 성공적으로 조회했습니다.',
      data: housingSupply,
    };
  }

  // 주택 공급 정보 업데이트
  async update(
    id: number,
    updateHousingSupplyDto: UpdateHousingSupplyDto,
  ): Promise<UpdateHousingSupplyResponseDto> {
    this.logger.log(
      `주택 공급 정보 업데이트: ID=${id}, 데이터=${JSON.stringify(updateHousingSupplyDto)}`,
    );

    const housingSupply = await this.housingSupplyRepository.findOne({
      where: { id },
    });

    if (!housingSupply) {
      throw new NotFoundException('주택 공급 정보를 찾을 수 없습니다.');
    }

    // 업데이트 실행
    await this.housingSupplyRepository.update(id, updateHousingSupplyDto);

    // 업데이트된 주택 공급 정보 조회
    const updatedSupply = await this.housingSupplyRepository.findOne({
      where: { id },
    });

    return {
      success: true,
      message: '주택 공급 정보가 성공적으로 업데이트되었습니다.',
      data: updatedSupply!,
    };
  }

  // 주택 공급 정보 삭제
  async remove(id: number): Promise<DeleteHousingSupplyResponseDto> {
    this.logger.log(`주택 공급 정보 삭제: ID=${id}`);

    const housingSupply = await this.housingSupplyRepository.findOne({
      where: { id },
    });

    if (!housingSupply) {
      throw new NotFoundException('주택 공급 정보를 찾을 수 없습니다.');
    }

    await this.housingSupplyRepository.delete(id);

    return {
      success: true,
      message: '주택 공급 정보가 성공적으로 삭제되었습니다.',
    };
  }

  // 좌표가 없는 주택 공급 정보 조회 (latitude 또는 longitude가 null인 것들)
  async findMissingCoordinates(
    query: GetHousingSuppliesQueryDto,
  ): Promise<GetHousingSuppliesResponseDto> {
    this.logger.log(
      `좌표가 없는 주택 공급 정보 조회: ${JSON.stringify(query)}`,
    );

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'rcritPblancDe';
    const sortOrder = query.sortOrder || 'DESC';

    // QueryBuilder 생성
    const queryBuilder =
      this.housingSupplyRepository.createQueryBuilder('housingSupply');

    // latitude 또는 longitude 중 하나라도 null인 조건 추가
    queryBuilder.andWhere(
      '(housingSupply.latitude IS NULL OR housingSupply.longitude IS NULL)',
    );

    // 검색 기능 (주택명, 주소, 공고번호에서 검색)
    if (query.search) {
      queryBuilder.andWhere(
        '(housingSupply.houseName ILIKE :search OR housingSupply.hssplyAdres ILIKE :search OR housingSupply.pblancNo ILIKE :search OR housingSupply.houseManageNo ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // 필터링
    if (query.houseSecd) {
      queryBuilder.andWhere('housingSupply.houseSecd = :houseSecd', {
        houseSecd: query.houseSecd,
      });
    }

    if (query.houseSecdNm) {
      queryBuilder.andWhere('housingSupply.houseSecdNm = :houseSecdNm', {
        houseSecdNm: query.houseSecdNm,
      });
    }

    if (query.houseDtlSecd) {
      queryBuilder.andWhere('housingSupply.houseDtlSecd = :houseDtlSecd', {
        houseDtlSecd: query.houseDtlSecd,
      });
    }

    if (query.rentSecd) {
      queryBuilder.andWhere('housingSupply.rentSecd = :rentSecd', {
        rentSecd: query.rentSecd,
      });
    }

    if (query.subscrptAreaCodeNm) {
      queryBuilder.andWhere(
        'housingSupply.subscrptAreaCodeNm = :subscrptAreaCodeNm',
        {
          subscrptAreaCodeNm: query.subscrptAreaCodeNm,
        },
      );
    }

    // 날짜 범위 필터링
    if (query.rcritPblancDeFrom) {
      queryBuilder.andWhere(
        'housingSupply.rcritPblancDe >= :rcritPblancDeFrom',
        {
          rcritPblancDeFrom: query.rcritPblancDeFrom,
        },
      );
    }

    if (query.rcritPblancDeTo) {
      queryBuilder.andWhere('housingSupply.rcritPblancDe <= :rcritPblancDeTo', {
        rcritPblancDeTo: query.rcritPblancDeTo,
      });
    }

    if (query.rceptBgndeFrom) {
      queryBuilder.andWhere('housingSupply.rceptBgnde >= :rceptBgndeFrom', {
        rceptBgndeFrom: query.rceptBgndeFrom,
      });
    }

    if (query.rceptBgndeTo) {
      queryBuilder.andWhere('housingSupply.rceptBgnde <= :rceptBgndeTo', {
        rceptBgndeTo: query.rceptBgndeTo,
      });
    }

    // 플래그 필터링
    if (query.parcprcUlsAt) {
      queryBuilder.andWhere('housingSupply.parcprcUlsAt = :parcprcUlsAt', {
        parcprcUlsAt: query.parcprcUlsAt,
      });
    }

    if (query.specltRdnEarthAt) {
      queryBuilder.andWhere(
        'housingSupply.specltRdnEarthAt = :specltRdnEarthAt',
        {
          specltRdnEarthAt: query.specltRdnEarthAt,
        },
      );
    }

    // 숨김 여부 필터 (isHidden: true일 때만 숨김 목록 포함, 기본값은 숨김 제외)
    if (query.isHidden !== true) {
      queryBuilder.andWhere('housingSupply.isHidden = :isHidden', {
        isHidden: false,
      });
    }

    // 정렬
    queryBuilder.orderBy(`housingSupply.${sortBy}`, sortOrder);

    // 전체 개수 조회 (필터링 적용)
    const total = await queryBuilder.getCount();

    // 페이징 적용
    queryBuilder.skip(skip).take(limit);

    // 데이터 조회
    const housingSupplies = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: '좌표가 없는 주택 공급 정보 목록을 성공적으로 조회했습니다.',
      data: housingSupplies,
      meta: {
        page,
        limit,
        total,
        totalPages,
        itemCount: housingSupplies.length,
      },
    };
  }
}

