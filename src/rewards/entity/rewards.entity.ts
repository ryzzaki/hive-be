import { Column, Entity, Unique } from 'typeorm';
import { BasicEntity } from '../../utils/basic.entity';

@Entity()
@Unique('single_session', ['wallet', 'walletSession'])
export class RewardsEntity extends BasicEntity {
  @Column()
  wallet: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  amount: number;

  @Column({ type: 'bigint' })
  walletSession: number;
}
