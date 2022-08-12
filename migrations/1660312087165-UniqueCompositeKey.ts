import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueCompositeKey1660312087165 implements MigrationInterface {
    name = 'UniqueCompositeKey1660312087165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD "sessionCount" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD CONSTRAINT "single_session" UNIQUE ("wallet", "sessionCount")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP CONSTRAINT "single_session"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP COLUMN "sessionCount"`);
    }

}
