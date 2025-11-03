import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipUserPosts1762137850047 implements MigrationInterface {
    name = 'AddRelationshipUserPosts1762137850047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_57d7c984ba4a3fa3b4ea2fb5553" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_57d7c984ba4a3fa3b4ea2fb5553"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "user_id"`);
    }

}
