import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagsAndBlogtagsEntity1762915023915 implements MigrationInterface {
    name = 'AddTagsAndBlogtagsEntity1762915023915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tag_name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_tags" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "postsId" integer, "tagsId" integer, CONSTRAINT "PK_8880485f371f1892310811845c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_83289c5274af1a5423c227967bc" FOREIGN KEY ("postsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_1dfae98fc493b60b7072f103343" FOREIGN KEY ("tagsId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_1dfae98fc493b60b7072f103343"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_83289c5274af1a5423c227967bc"`);
        await queryRunner.query(`DROP TABLE "blog_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
