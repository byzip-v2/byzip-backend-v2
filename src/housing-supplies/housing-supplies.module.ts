import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousingSupply } from '../scheduler/entities/housing-supply.entity';
import { HousingSuppliesController } from './housing-supplies.controller';
import { HousingSuppliesService } from './housing-supplies.service';

@Module({
  imports: [TypeOrmModule.forFeature([HousingSupply])],
  controllers: [HousingSuppliesController],
  providers: [HousingSuppliesService],
  exports: [HousingSuppliesService],
})
export class HousingSuppliesModule {}

