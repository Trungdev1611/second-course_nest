import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToNotification1764500000000 implements MigrationInterface {
  name = 'AddStatusToNotification1764500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_status_enum" AS ENUM('pending', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
  }
}

