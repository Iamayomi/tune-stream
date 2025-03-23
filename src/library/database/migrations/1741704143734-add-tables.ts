import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1741704143734 implements MigrationInterface {
    name = 'AddTables1741704143734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlists" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" integer, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "releaseDate" date NOT NULL, "genre" character varying(100) NOT NULL DEFAULT 'Other', "coverImage" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "artistId" integer, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs" ("songId" SERIAL NOT NULL, "title" character varying NOT NULL, "releaseDate" date NOT NULL, "duration" TIME NOT NULL, "lyrics" text NOT NULL, "coverImage" character varying NOT NULL, "popularity" integer NOT NULL, "genre" character varying(100) NOT NULL DEFAULT 'Other', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "albumId" integer, CONSTRAINT "PK_f95750e0f0d5c11a14e6eed4489" PRIMARY KEY ("songId"))`);
        await queryRunner.query(`CREATE TABLE "artists" ("id" SERIAL NOT NULL, "stageName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" integer, CONSTRAINT "REL_ad6425a70866031e2945b336cc" UNIQUE ("userUserId"), CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("subscriptionId" SERIAL NOT NULL, "plan" "public"."subscription_plan_enum" NOT NULL, "subscribedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP WITH TIME ZONE, "active" boolean NOT NULL DEFAULT false, "discount" character varying, "userUserId" integer, CONSTRAINT "PK_13cecd7da6abc7ae934d8560bef" PRIMARY KEY ("subscriptionId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("userId" SERIAL NOT NULL, "fullName" character varying, "bio" text, "profileImage" character varying, "username" character varying, "phone" character varying NOT NULL DEFAULT 'user', "email" character varying NOT NULL, "subscription" character varying NOT NULL DEFAULT 'free', "terms_of_service" boolean NOT NULL DEFAULT 'false', "roles" text array NOT NULL DEFAULT '{user}', "password" character varying NOT NULL, "api_key" character varying NOT NULL, "verified_email" boolean NOT NULL DEFAULT false, "verified_phone" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "songs_artists" ("songsSongId" integer NOT NULL, "artistsId" integer NOT NULL, CONSTRAINT "PK_353557f4a70c0687680f63ce5b9" PRIMARY KEY ("songsSongId", "artistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1a80fbd16110c32f2857699a1a" ON "songs_artists" ("songsSongId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f43a7e4032521e4edd2e7ecd2" ON "songs_artists" ("artistsId") `);
        await queryRunner.query(`CREATE TABLE "songs_playlists" ("songsSongId" integer NOT NULL, "playlistsId" integer NOT NULL, CONSTRAINT "PK_dadae6546df4bceca9ca0e5fa89" PRIMARY KEY ("songsSongId", "playlistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_318f18c6019830fee9542e99e9" ON "songs_playlists" ("songsSongId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ce702189cd4577e057ea3d100" ON "songs_playlists" ("playlistsId") `);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_798ee9e8204bf9fc595dba3b8c7" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_3807642f5c436d2492f486567fc" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artists" ADD CONSTRAINT "FK_ad6425a70866031e2945b336ccc" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_d0f4e320ce583680dcbefa8cb08" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_1a80fbd16110c32f2857699a1ae" FOREIGN KEY ("songsSongId") REFERENCES "songs"("songId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" ADD CONSTRAINT "FK_318f18c6019830fee9542e99e92" FOREIGN KEY ("songsSongId") REFERENCES "songs"("songId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" ADD CONSTRAINT "FK_7ce702189cd4577e057ea3d1004" FOREIGN KEY ("playlistsId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs_playlists" DROP CONSTRAINT "FK_7ce702189cd4577e057ea3d1004"`);
        await queryRunner.query(`ALTER TABLE "songs_playlists" DROP CONSTRAINT "FK_318f18c6019830fee9542e99e92"`);
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29"`);
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_1a80fbd16110c32f2857699a1ae"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_d0f4e320ce583680dcbefa8cb08"`);
        await queryRunner.query(`ALTER TABLE "artists" DROP CONSTRAINT "FK_ad6425a70866031e2945b336ccc"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_3807642f5c436d2492f486567fc"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_798ee9e8204bf9fc595dba3b8c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ce702189cd4577e057ea3d100"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_318f18c6019830fee9542e99e9"`);
        await queryRunner.query(`DROP TABLE "songs_playlists"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f43a7e4032521e4edd2e7ecd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a80fbd16110c32f2857699a1a"`);
        await queryRunner.query(`DROP TABLE "songs_artists"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "artists"`);
        await queryRunner.query(`DROP TABLE "songs"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
    }

}
