import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFriends1764042115908 implements MigrationInterface {
    name = 'UpdateFriends1764042115908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friendship" ("user_target_id" integer NOT NULL, "friend_id" integer NOT NULL, CONSTRAINT "PK_26dcdad83062dd27a0688f59641" PRIMARY KEY ("user_target_id", "friend_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_20085ade89f9a4f36775a8e459" ON "friendship" ("user_target_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8cadaad5534dd8b4827f05968e" ON "friendship" ("friend_id") `);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_20085ade89f9a4f36775a8e4597" FOREIGN KEY ("user_target_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_8cadaad5534dd8b4827f05968ef" FOREIGN KEY ("friend_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_8cadaad5534dd8b4827f05968ef"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_20085ade89f9a4f36775a8e4597"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8cadaad5534dd8b4827f05968e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20085ade89f9a4f36775a8e459"`);
        await queryRunner.query(`DROP TABLE "friendship"`);
    }

}
