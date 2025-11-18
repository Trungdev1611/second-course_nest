import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDeleteatTagTable1763440033896 implements MigrationInterface {
    name = 'UpdateDeleteatTagTable1763440033896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "removedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "removedAt"`);
    }

}
