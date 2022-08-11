import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableAmount1660258703363 implements MigrationInterface {
    name = 'NullableAmount1660258703363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" ALTER COLUMN "amount" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_entity" ALTER COLUMN "amount" SET NOT NULL`);
    }

}
