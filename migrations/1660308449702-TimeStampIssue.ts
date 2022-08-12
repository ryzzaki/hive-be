import { MigrationInterface, QueryRunner } from "typeorm";

export class TimeStampIssue1660308449702 implements MigrationInterface {
    name = 'TimeStampIssue1660308449702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
