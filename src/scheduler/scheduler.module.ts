import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousingSupply } from './entities/housing-supply.entity';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { PublicDataService } from './services/public-data.service';
import { SlackService } from './services/slack.service';

@Module({
  imports: [TypeOrmModule.forFeature([HousingSupply])],
  controllers: [SchedulerController],
  providers: [SchedulerService, PublicDataService, SlackService],
  exports: [SchedulerService],
})
export class SchedulerModule {}

