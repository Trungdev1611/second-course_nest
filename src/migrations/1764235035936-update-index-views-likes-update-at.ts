import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndexViewsLikesUpdateAt1764235035936 implements MigrationInterface {
    name = 'UpdateIndexViewsLikesUpdateAt1764235035936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_blog_likes_updated_at" ON "blogs" ("likes", "updated_at") `);
        await queryRunner.query(`CREATE INDEX "idx_blog_views_updated_at" ON "blogs" ("views", "updated_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_blog_views_updated_at"`);
        await queryRunner.query(`DROP INDEX "public"."idx_blog_likes_updated_at"`);
    }

}
