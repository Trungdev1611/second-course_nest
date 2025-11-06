import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLikes1762336359113 implements MigrationInterface {
    name = 'CreateTableLikes1762336359113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."likes_likeable_type_enum" AS ENUM('post', 'comment')`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "likeable_type" "public"."likes_likeable_type_enum" NOT NULL, "likeable_id" integer NOT NULL, "userId" integer, CONSTRAINT "UQ_a872bdf4ca97733213cf7586b8a" UNIQUE ("userId", "likeable_type", "likeable_id"), CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TYPE "public"."likes_likeable_type_enum"`);
    }

}
