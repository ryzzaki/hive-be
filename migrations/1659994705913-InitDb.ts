import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1659994705913 implements MigrationInterface {
    name = 'InitDb1659994705913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rewards_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "wallet" character varying NOT NULL, "isCompleted" boolean NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_1e35c13a98af16d8a2f5c65a4c1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rewards_entity"`);
    }

}
