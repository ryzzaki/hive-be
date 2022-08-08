import { Module } from '@nestjs/common';
import { RewardsModule } from './rewards/rewards.module';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    RewardsModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: ConfigService,
    }),
  ],
})
export class AppModule {}
