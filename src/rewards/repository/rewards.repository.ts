import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Between, Repository } from 'typeorm';
import transactionWrapper from '../../utils/transactionWrapper';
import { RewardsEntity } from '../entity/rewards.entity';

@Injectable()
export class RewardsRepository {
  constructor(
    @InjectRepository(RewardsEntity)
    private readonly rewardsRepository: Repository<RewardsEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async startSessionTransaction(
    address: string,
    maxReward: number,
    maxSessions: number,
  ): Promise<RewardsEntity | undefined> {
    return transactionWrapper<RewardsEntity>(this.dataSource, async (qr) => {
      const now = Date.now();
      const existingSessions = await qr.manager.find(RewardsEntity, {
        where: {
          wallet: address,
          createdAt: Between(
            new Date(now - 24 * 60 * 60 * 1000),
            new Date(now),
          ),
        },
        order: {
          createdAt: 'DESC',
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      const isLowerThanPomoSession =
        existingSessions.length > 0
          ? now - existingSessions.at(0).createdAt.getTime() > 25 * 60 * 1000
          : false;

      // don't create a session if there are 4 sessions already, and the latest one is not greater than 25 minutes
      // to prevent the edge case of endlessly creating infinite new sessions
      if (existingSessions.length === maxSessions || isLowerThanPomoSession) {
        return undefined;
      }

      let amountOverLastDay = 0;
      existingSessions.map((s) => {
        if (s.amount && s.isCompleted) {
          amountOverLastDay += s.amount;
        }
      });

      // only create a session, if the amount of rewards is smaller than the threshold
      if (amountOverLastDay < maxReward) {
        const r = new RewardsEntity();
        r.wallet = address;
        r.walletSession =
          existingSessions.length > 0
            ? existingSessions.at(0).walletSession + 1
            : 1;
        const res = await qr.manager.insert(RewardsEntity, r);
        return res.raw.pop() as RewardsEntity;
      }
    });
  }

  async completeSession(
    address: string,
    maxReward: number,
    triggerClaim: () => Promise<void>,
  ): Promise<boolean> {
    return await transactionWrapper(this.dataSource, async (qr) => {
      const now = Date.now();
      const existingSessions = await qr.manager.find(RewardsEntity, {
        where: {
          wallet: address,
          createdAt: Between(
            new Date(now - 24 * 60 * 60 * 1000),
            new Date(now),
          ),
        },
        order: {
          createdAt: 'DESC',
        },
        lock: {
          mode: 'pessimistic_read',
        },
      });

      const isLowerThanPomoSession =
        existingSessions.length > 0
          ? now - existingSessions.at(0).createdAt.getTime() > 25 * 60 * 1000
          : false;

      // don't do anything if the latest session is not greater than 25 minutes
      // don't do anything if the latest session is already completed - avoid reward duplication
      if (isLowerThanPomoSession || existingSessions.at(0).isCompleted) {
        return false;
      }

      let amountOverLastDay = 0;
      existingSessions.map((s) => {
        if (s.amount && s.isCompleted) {
          amountOverLastDay += s.amount;
        }
      });

      if (amountOverLastDay < maxReward) {
        const latestSession = existingSessions[0];
        latestSession.isCompleted = true;
        latestSession.amount = 1;
        const result = await qr.manager.update(
          RewardsEntity,
          { id: latestSession.id },
          latestSession,
        );

        // this function will execute the polygon transaction
        await triggerClaim();

        return result.affected > 0;
      }
    });
  }

  async getRewardsForParticipant(wallet: string): Promise<RewardsEntity[]> {
    return await this.dataSource.manager.find(RewardsEntity, {
      where: { wallet },
    });
  }

  async getRewardsForParticipantToday(
    wallet: string,
  ): Promise<RewardsEntity[]> {
    const now = Date.now();
    const existingSessions = await this.dataSource.manager.find(RewardsEntity, {
      where: {
        wallet,
        createdAt: Between(new Date(now - 24 * 60 * 60 * 1000), new Date(now)),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return existingSessions;
  }
}
