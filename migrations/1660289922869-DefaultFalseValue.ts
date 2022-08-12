import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultFalseValue1660289922869 implements MigrationInterface {
    name = 'DefaultFalseValue1660289922869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" ALTER COLUMN "isCompleted" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" ALTER COLUMN "isCompleted" DROP DEFAULT`);
    }

}
