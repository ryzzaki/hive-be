import { Column, Entity } from 'typeorm';
import { BasicEntity } from '../../utils/basic.entity';

@Entity()
export class RewardsEntity extends BasicEntity {
  @Column()
  wallet: string;

  @Column()
  isCompleted: boolean;

  @Column()
  amount: number;
}
