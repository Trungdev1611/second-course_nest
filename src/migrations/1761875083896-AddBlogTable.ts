import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlogTable1761875083896 implements MigrationInterface {
    name = 'AddBlogTable1761875083896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."blogs_status_enum" AS ENUM('draft', 'published', 'archived')`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "content" text NOT NULL, "excerpt" character varying, "thumbnail" character varying, "status" "public"."blogs_status_enum" NOT NULL DEFAULT 'draft', "views" integer NOT NULL DEFAULT '0', "likes" integer NOT NULL DEFAULT '0', "reading_time" integer, "tags" text, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TYPE "public"."blogs_status_enum"`);
    }

}
