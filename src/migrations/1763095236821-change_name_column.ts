import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameColumn1763095236821 implements MigrationInterface {
    name = 'ChangeNameColumn1763095236821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_83289c5274af1a5423c227967bc"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_1dfae98fc493b60b7072f103343"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP COLUMN "postsId"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP COLUMN "tagsId"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD "post_id" integer`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD "tag_id" integer`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_404c73c52c87b543134edb7f80c" FOREIGN KEY ("post_id") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_404c73c52c87b543134edb7f80c"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP COLUMN "tag_id"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD "tagsId" integer`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD "postsId" integer`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_1dfae98fc493b60b7072f103343" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_83289c5274af1a5423c227967bc" FOREIGN KEY ("postsId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
