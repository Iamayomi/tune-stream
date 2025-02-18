import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTermsAndCondition1739785250024 implements MigrationInterface {
  name = 'AddTermsAndCondition1739785250024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "songs" ADD "popularity" integer NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "terms_of_service" character varying NOT NULL DEFAULT 'false'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "terms_of_service"`,
    );
    await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "popularity"`);
  }
}
