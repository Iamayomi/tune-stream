import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserCode1741876937517 implements MigrationInterface {
    name = 'AddUserCode1741876937517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "terms_of_service" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "code" integer`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "terms_of_service" SET DEFAULT false`);
    }

}
