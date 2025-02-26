import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserColumns1740362549111 implements MigrationInterface {
    name = 'AddUserColumns1740362549111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "terms_of_service"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "terms_of_service" boolean NOT NULL DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "terms_of_service"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "terms_of_service" character varying NOT NULL DEFAULT 'false'`);
    }

}
