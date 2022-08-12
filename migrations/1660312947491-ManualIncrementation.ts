import { MigrationInterface, QueryRunner } from "typeorm";

export class ManualIncrementation1660312947491 implements MigrationInterface {
    name = 'ManualIncrementation1660312947491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" RENAME COLUMN "sessionCount" TO "walletSession"`);
        await queryRunner.query(`ALTER SEQUENCE "rewards_entity_sessionCount_seq" RENAME TO "rewards_entity_walletSession_seq"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ALTER COLUMN "walletSession" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "rewards_entity_walletSession_seq"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "rewards_entity_walletSession_seq" OWNED BY "rewards_entity"."walletSession"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" ALTER COLUMN "walletSession" SET DEFAULT nextval('"rewards_entity_walletSession_seq"')`);
        await queryRunner.query(`ALTER SEQUENCE "rewards_entity_walletSession_seq" RENAME TO "rewards_entity_sessionCount_seq"`);
        await queryRunner.query(`ALTER TABLE "rewards_entity" RENAME COLUMN "walletSession" TO "sessionCount"`);
    }

}
