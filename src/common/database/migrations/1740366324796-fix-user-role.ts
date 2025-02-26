import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserRole1740366324796 implements MigrationInterface {
    name = 'FixUserRole1740366324796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "role" TO "roles"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "terms_of_service" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" text array NOT NULL DEFAULT '{user}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" character varying NOT NULL DEFAULT '["user"]'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "terms_of_service" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "roles" TO "role"`);
    }

}
