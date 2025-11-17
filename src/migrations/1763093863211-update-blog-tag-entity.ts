import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBlogTagEntity1763093863211 implements MigrationInterface {
    name = 'UpdateBlogTagEntity1763093863211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_83289c5274af1a5423c227967bc"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_1dfae98fc493b60b7072f103343"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_83289c5274af1a5423c227967bc" FOREIGN KEY ("postsId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_1dfae98fc493b60b7072f103343" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_1dfae98fc493b60b7072f103343"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_83289c5274af1a5423c227967bc"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_1dfae98fc493b60b7072f103343" FOREIGN KEY ("tagsId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_83289c5274af1a5423c227967bc" FOREIGN KEY ("postsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
