import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsAndTable1740349453184 implements MigrationInterface {
    name = 'AddColumnsAndTable1740349453184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."subscription_plan_enum" RENAME TO "subscription_plan_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_plan_enum" AS ENUM('free', 'monthly', 'annual')`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "plan" TYPE "public"."subscription_plan_enum" USING "plan"::"text"::"public"."subscription_plan_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_plan_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refresh_token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "verified_email" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "verified_phone" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "verified_phone" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "verified_email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refresh_token" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_plan_enum_old" AS ENUM('monthly', 'annual')`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "plan" TYPE "public"."subscription_plan_enum_old" USING "plan"::"text"::"public"."subscription_plan_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_plan_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."subscription_plan_enum_old" RENAME TO "subscription_plan_enum"`);
    }

}
