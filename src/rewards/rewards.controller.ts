import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { SessionDto } from './dto/session.dto';
import { RewardsEntity } from './entity/rewards.entity';
import { RewardsService } from './rewards.service';

@Controller('/api/v1/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post('/start')
  async startSession(@Body(ValidationPipe) sessionDto: SessionDto) {
    const { participant } = sessionDto;
    return this.rewardsService.start(participant);
  }

  @Post('/claim')
  async claimReward(@Body(ValidationPipe) sessionDto: SessionDto) {
    const { participant } = sessionDto;
    return this.rewardsService.claim(participant);
  }

  @Get('/:wallet')
  async getRewards(
    @Param('wallet') participant: string,
  ): Promise<RewardsEntity[]> {
    return this.rewardsService.getRewardsForParticipant(participant);
  }

  @Get('/:wallet/today')
  async getRewardsToday(
    @Param('wallet') participant: string,
  ): Promise<{ rewards: number; sessions: number }> {
    return this.rewardsService.getRewardsForParticipantToday(participant);
  }
}
