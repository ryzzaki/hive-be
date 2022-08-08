import { Module } from '@nestjs/common';
import { RewardsModule } from './rewards/rewards.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [RewardsModule, ConfigModule],
})
export class AppModule {}
