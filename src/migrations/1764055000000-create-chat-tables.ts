import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatTables1764055000000 implements MigrationInterface {
  name = 'CreateChatTables1764055000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."chat_conversations_type_enum" AS ENUM('direct', 'group')`,
    );
    await queryRunner.query(`
      CREATE TABLE "chat_conversations" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "conversation_key" character varying NOT NULL,
        "type" "public"."chat_conversations_type_enum" NOT NULL DEFAULT 'direct',
        "title" character varying,
        CONSTRAINT "PK_chat_conversations_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_chat_conversations_conversation_key" UNIQUE ("conversation_key")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "chat_messages" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "conversation_id" integer NOT NULL,
        "sender_id" integer NOT NULL,
        "content" text NOT NULL,
        "attachment_url" character varying,
        "reply_to_id" integer,
        "message_key" character varying,
        CONSTRAINT "PK_chat_messages_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_chat_messages_message_key" UNIQUE ("message_key")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_chat_messages_conversation_id" ON "chat_messages" ("conversation_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_messages_sender_id" ON "chat_messages" ("sender_id")`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."chat_participants_role_enum" AS ENUM('member', 'admin')`,
    );
    await queryRunner.query(`
      CREATE TABLE "chat_participants" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "conversation_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "last_read_message_id" integer,
        "role" "public"."chat_participants_role_enum" NOT NULL DEFAULT 'member',
        CONSTRAINT "PK_chat_participants_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_chat_participants_conversation_user" UNIQUE ("conversation_id", "user_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_participants_user_id" ON "chat_participants" ("user_id")`,
    );

    await queryRunner.query(`
      ALTER TABLE "chat_messages"
        ADD CONSTRAINT "FK_chat_messages_conversation" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "chat_messages"
        ADD CONSTRAINT "FK_chat_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "chat_messages"
        ADD CONSTRAINT "FK_chat_messages_reply" FOREIGN KEY ("reply_to_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "chat_participants"
        ADD CONSTRAINT "FK_chat_participants_conversation" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "chat_participants"
        ADD CONSTRAINT "FK_chat_participants_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "chat_participants"
        ADD CONSTRAINT "FK_chat_participants_last_read_message" FOREIGN KEY ("last_read_message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_chat_participants_last_read_message"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_chat_participants_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_chat_participants_conversation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_chat_messages_reply"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_chat_messages_sender"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_chat_messages_conversation"`,
    );

    await queryRunner.query(`DROP INDEX "public"."IDX_chat_participants_user_id"`);
    await queryRunner.query(`DROP TABLE "chat_participants"`);
    await queryRunner.query(`DROP TYPE "public"."chat_participants_role_enum"`);

    await queryRunner.query(`DROP INDEX "public"."IDX_chat_messages_sender_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_chat_messages_conversation_id"`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);

    await queryRunner.query(`DROP TABLE "chat_conversations"`);
    await queryRunner.query(`DROP TYPE "public"."chat_conversations_type_enum"`);
  }
}

