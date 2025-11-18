import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableBlogTagsCascade1763437614815 implements MigrationInterface {
    name = 'UpdateTableBlogTagsCascade1763437614815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
