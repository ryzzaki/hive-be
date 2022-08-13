import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as ethers from 'ethers';
import { configService } from '../config/config.service';
import { ConfigKeys } from '../config/configKeys.enum';
import { manager } from '../constants/manager';
import { RewardsEntity } from './entity/rewards.entity';
import { RewardsRepository } from './repository/rewards.repository';

@Injectable()
export class RewardsService implements OnModuleInit {
  private provider: ethers.providers.AlchemyProvider | null;
  private signer: ethers.Wallet | null;
  private contract: ethers.Contract | null;

  private readonly rewardAmount = '1';
  private readonly maxReward = 4;
  private readonly maxSessions = 4;

  constructor(private readonly rewardsRepository: RewardsRepository) {}

  onModuleInit() {
    this.provider = new ethers.providers.AlchemyProvider(
      configService.get(ConfigKeys.IS_MAINNET) ? 'matic' : 'maticmum',
      configService.get(ConfigKeys.API_KEY),
    );
    this.signer = new ethers.Wallet(
      configService.get(ConfigKeys.PRIVATE_KEY),
      this.provider,
    );
    this.contract = new ethers.Contract(
      manager.address,
      manager.abi,
      this.signer,
    );
  }

  async start(address: string) {
    const result = await this.rewardsRepository.startSessionTransaction(
      address,
      this.maxReward,
      this.maxSessions,
    );

    if (!result) {
      throw new BadRequestException('Session has already started!');
    }

    return result;
  }

  async claim(address: string) {
    if (!this.provider || !this.signer || !this.contract) {
      throw new InternalServerErrorException(
        'Web3 components are not initialised!',
      );
    }

    return await this.rewardsRepository.completeSession(
      address,
      this.maxReward,
      async () => {
        // if the polygon transaction fails, then the entire database transaction will rollback
        try {
          const parsedAmount = ethers.utils.parseUnits(
            this.rewardAmount,
            'ether',
          );
          const txHash = await this.contract.mintReward(address, parsedAmount, {
            gasPrice: ethers.utils.parseUnits('60', 'gwei'),
            gasLimit: '450000',
          });
          await txHash.wait();
        } catch (e) {
          throw new InternalServerErrorException(
            `Polygon Transaction Failed! ${e.message}`,
          );
        }
      },
    );
  }

  async getRewardsForParticipant(
    participant: string,
  ): Promise<RewardsEntity[]> {
    return this.rewardsRepository.getRewardsForParticipant(participant);
  }

  async getRewardsForParticipantToday(
    participant: string,
  ): Promise<{ rewards: number; sessions: number }> {
    const existingSessions =
      await this.rewardsRepository.getRewardsForParticipantToday(participant);
    let amountOverLastDay = 0;
    existingSessions.map((s) => {
      if (s.amount && s.isCompleted) {
        amountOverLastDay += s.amount;
      }
    });
    return { rewards: amountOverLastDay, sessions: existingSessions.length };
  }
}
