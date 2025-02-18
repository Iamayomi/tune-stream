import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscription1739140325993 implements MigrationInterface {
    name = 'AddSubscription1739140325993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "subscription" character varying NOT NULL DEFAULT 'free'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subscription"`);
    }

}
