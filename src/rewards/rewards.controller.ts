import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SessionDto } from './dto/session.dto';
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
}
