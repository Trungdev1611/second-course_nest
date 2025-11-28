import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFulltextSearchIndex1764296000000 implements MigrationInterface {
    name = 'AddFulltextSearchIndex1764296000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tạo GIN index cho full-text search (dùng 'simple' để support tiếng Việt)
        await queryRunner.query(`
            CREATE INDEX "idx_blogs_fulltext_search" 
            ON "blogs" 
            USING GIN(to_tsvector('simple', COALESCE("title", '') || ' ' || COALESCE("excerpt", '') || ' ' || COALESCE("content", '')));
        `);
        
        // Index composite cho status + updated_at (để tối ưu query với filter status)
        await queryRunner.query(`
            CREATE INDEX "idx_blogs_status_updated_at" 
            ON "blogs" ("status", "updated_at" DESC) 
            WHERE "status" = 'published';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_blogs_status_updated_at"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_blogs_fulltext_search"`);
    }
}

