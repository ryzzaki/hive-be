import { Column, Entity } from 'typeorm';
import { BasicEntity } from '../../utils/basic.entity';

@Entity()
export class RewardsEntity extends BasicEntity {
  @Column()
  wallet: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  amount: number;
}
