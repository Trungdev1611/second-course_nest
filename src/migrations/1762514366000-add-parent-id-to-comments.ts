import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParentIdToComments1762514366000 implements MigrationInterface {
    name = 'AddParentIdToComments1762514366000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Thêm parent_id column vào comments table
        await queryRunner.query(`ALTER TABLE "comments" ADD "parent_id" integer`);
        // Thêm foreign key constraint cho self-referencing
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_comments_parent_id" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_parent_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "parent_id"`);
    }
}

