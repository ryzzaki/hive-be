import { MigrationInterface, QueryRunner } from "typeorm";

export class SetBigIntType1660390277246 implements MigrationInterface {
    name = 'SetBigIntType1660390277246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP CONSTRAINT "single_session"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP COLUMN "walletSession"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD "walletSession" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD CONSTRAINT "single_session" UNIQUE ("wallet", "walletSession")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP CONSTRAINT "single_session"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" DROP COLUMN "walletSession"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD "walletSession" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ADD CONSTRAINT "single_session" UNIQUE ("wallet", "walletSession")`);
    }

}
