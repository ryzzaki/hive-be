import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { RewardsEntity } from './entity/rewards.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsRepository } from './repository/rewards.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RewardsEntity])],
  providers: [RewardsService, RewardsRepository],
  controllers: [RewardsController],
})
export class RewardsModule {}
