import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as ethers from 'ethers';
import { configService } from '../config/config.service';
import { ConfigKeys } from '../config/configKeys.enum';
import { manager } from '../constants/manager';

@Injectable()
export class RewardsService implements OnModuleInit {
  private provider: ethers.providers.AlchemyProvider | null;
  private signer: ethers.Wallet | null;
  private contract: ethers.Contract | null;

  private readonly rewardAmount = '1';

  onModuleInit() {
    this.provider = new ethers.providers.AlchemyProvider(
      configService.isProduction() ? 'matic' : 'maticmum',
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
    try {
      // first find the latest session for the address - if undefined, ignore rest
      // check if the session is older than 25 minutes
      // if session is not older than 25 minutes - do not start
      // if number of rewards is already 4 in the past 24 hours, do not start
    } catch (e) {
      throw new InternalServerErrorException(
        `Something went wrong ${e.message}`,
      );
    }
  }

  async claim(address: string) {
    if (!this.provider || !this.signer || !this.contract) {
      throw new InternalServerErrorException(
        'Web3 components are not initialised!',
      );
    }

    try {
      // find the LATEST started session
      // validate the time - if less than 25 minutes - nope
      // payout the reward
      // if number of rewards is already 4 in the past 24 hours, do not claim
      const parsedAmount = ethers.utils.parseUnits(this.rewardAmount, 'ether');
      const txHash = await this.contract.mintReward(address, parsedAmount, {
        gasPrice: ethers.utils.parseUnits('50', 'gwei'),
        gasLimit: '500000',
      });
      await txHash.wait();
    } catch (e) {
      throw new InternalServerErrorException(
        `Something went wrong ${e.message}`,
      );
    }
  }
}
