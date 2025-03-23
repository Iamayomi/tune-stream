import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRefreshToken1742424330522 implements MigrationInterface {
    name = 'AddUserRefreshToken1742424330522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs_playlists" DROP CONSTRAINT "FK_7ce702189cd4577e057ea3d1004"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ce702189cd4577e057ea3d100"`);
        await queryRunner.query(`ALTER TABLE "playlists" RENAME COLUMN "id" TO "playlistId"`);
        await queryRunner.query(`ALTER TABLE "playlists" RENAME CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" TO "PK_4277bf255168d686462747df5b1"`);
        await queryRunner.query(`ALTER SEQUENCE "playlists_id_seq" RENAME TO "playlists_playlistId_seq"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "code" TO "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" RENAME COLUMN "playlistsId" TO "playlistsPlaylistId"`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" RENAME CONSTRAINT "PK_dadae6546df4bceca9ca0e5fa89" TO "PK_0e002e85b73569ce29c29118fbd"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profileImage" SET DEFAULT 'https://api.dicebear.com/6.x/notionists-neutral/svg?seed=Bob'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "terms_of_service" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_5230070094e8135a3d763d90e75" UNIQUE ("refresh_token")`);
        await queryRunner.query(`CREATE INDEX "IDX_4dfecf36ac2798ee6f02dc4c00" ON "songs_playlists" ("playlistsPlaylistId") `);
        await queryRunner.query(`ALTER TABLE "songs_playlists" ADD CONSTRAINT "FK_4dfecf36ac2798ee6f02dc4c003" FOREIGN KEY ("playlistsPlaylistId") REFERENCES "playlists"("playlistId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs_playlists" DROP CONSTRAINT "FK_4dfecf36ac2798ee6f02dc4c003"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4dfecf36ac2798ee6f02dc4c00"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_5230070094e8135a3d763d90e75"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "terms_of_service" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profileImage" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" RENAME CONSTRAINT "PK_0e002e85b73569ce29c29118fbd" TO "PK_dadae6546df4bceca9ca0e5fa89"`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" RENAME COLUMN "playlistsPlaylistId" TO "playlistsId"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refresh_token" TO "code"`);
        await queryRunner.query(`ALTER SEQUENCE "playlists_playlistId_seq" RENAME TO "playlists_id_seq"`);
        await queryRunner.query(`ALTER TABLE "playlists" RENAME CONSTRAINT "PK_4277bf255168d686462747df5b1" TO "PK_a4597f4189a75d20507f3f7ef0d"`);
        await queryRunner.query(`ALTER TABLE "playlists" RENAME COLUMN "playlistId" TO "id"`);
        await queryRunner.query(`CREATE INDEX "IDX_7ce702189cd4577e057ea3d100" ON "songs_playlists" ("playlistsId") `);
        await queryRunner.query(`ALTER TABLE "songs_playlists" ADD CONSTRAINT "FK_7ce702189cd4577e057ea3d1004" FOREIGN KEY ("playlistsId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
