import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnVerifyEmail1761895875144 implements MigrationInterface {
    name = 'AddColumnVerifyEmail1761895875144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "is_verify_email" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verify_email"`);
    }

}
