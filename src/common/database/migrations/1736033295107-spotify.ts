import { MigrationInterface, QueryRunner } from "typeorm";

export class Spotify1736033295107 implements MigrationInterface {
    name = 'Spotify1736033295107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlists" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "releaseDate" date NOT NULL, "genre" character varying(100) NOT NULL DEFAULT 'Other', "coverImage" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "artistId" integer, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "releaseDate" date NOT NULL, "duration" TIME NOT NULL, "lyrics" text NOT NULL, "coverImage" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "albumId" integer, CONSTRAINT "PK_e504ce8ad2e291d3a1d8f1ea2f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artists" ("id" SERIAL NOT NULL, "stageName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_f7bd9114dc2849a90d39512911" UNIQUE ("userId"), CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "apiKey" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs_artists" ("songsId" integer NOT NULL, "artistsId" integer NOT NULL, CONSTRAINT "PK_78eb64551964b78d544c2ac019b" PRIMARY KEY ("songsId", "artistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_971d95bf6df45f2b07c317b6b3" ON "songs_artists" ("songsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f43a7e4032521e4edd2e7ecd2" ON "songs_artists" ("artistsId") `);
        await queryRunner.query(`CREATE TABLE "songs_playlists" ("songsId" integer NOT NULL, "playlistsId" integer NOT NULL, CONSTRAINT "PK_ea21996b44cd84f5d4229bff291" PRIMARY KEY ("songsId", "playlistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a9c4ba119a52a27ffea39690ac" ON "songs_playlists" ("songsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ce702189cd4577e057ea3d100" ON "songs_playlists" ("playlistsId") `);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_708a919e9aa49019000d9e9b68e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_3807642f5c436d2492f486567fc" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artists" ADD CONSTRAINT "FK_f7bd9114dc2849a90d39512911b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" ADD CONSTRAINT "FK_a9c4ba119a52a27ffea39690acf" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" ADD CONSTRAINT "FK_7ce702189cd4577e057ea3d1004" FOREIGN KEY ("playlistsId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs_playlists" DROP CONSTRAINT "FK_7ce702189cd4577e057ea3d1004"`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" DROP CONSTRAINT "FK_a9c4ba119a52a27ffea39690acf"`);
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29"`);
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34"`);
        await queryRunner.query(`ALTER TABLE "artists" DROP CONSTRAINT "FK_f7bd9114dc2849a90d39512911b"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_3807642f5c436d2492f486567fc"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_708a919e9aa49019000d9e9b68e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ce702189cd4577e057ea3d100"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a9c4ba119a52a27ffea39690ac"`);
        await queryRunner.query(`DROP TABLE "songs_playlists"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f43a7e4032521e4edd2e7ecd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_971d95bf6df45f2b07c317b6b3"`);
        await queryRunner.query(`DROP TABLE "songs_artists"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "artists"`);
        await queryRunner.query(`DROP TABLE "songs"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
    }

}
