import { MigrationInterface, QueryRunner } from "typeorm";

export class FixesApiKey1742463665366 implements MigrationInterface {
    name = 'FixesApiKey1742463665366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profileImage" SET DEFAULT 'https://api.dicebear.com/6.x/fun-emoji/svg?seed=Tinkerbell'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "terms_of_service" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "api_key" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "api_key" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "terms_of_service" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" SET DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profileImage" SET DEFAULT 'https://api.dicebear.com/6.x/notionists-neutral/svg?seed=Bob'`);
    }

}
