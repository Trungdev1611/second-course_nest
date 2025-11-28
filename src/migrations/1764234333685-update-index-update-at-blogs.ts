import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndexUpdateAtBlogs1764234333685 implements MigrationInterface {
    name = 'UpdateIndexUpdateAtBlogs1764234333685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_chat_participants_conversation"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_chat_participants_user"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_chat_participants_last_read_message"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_chat_messages_conversation"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_chat_messages_sender"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_chat_messages_reply"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_notifications_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_notifications_is_read"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_chat_participants_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_chat_messages_conversation_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_chat_messages_sender_id"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "UQ_chat_participants_conversation_user"`);
        await queryRunner.query(`CREATE INDEX "idx_blog_updated_at_desc" ON "blogs" ("updated_at") `);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "UQ_dd056fd5d6c8628fa309d1c0a37" UNIQUE ("conversation_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_fb3a8029a2688a74971e918df79" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_b4129b3e21906ca57b503a1d834" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_b45b6002615900acda880360f26" FOREIGN KEY ("last_read_message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_3d623662d4ee1219b23cf61e649" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_9e5fc47ecb06d4d7b84633b1718" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_46d19cf514d5c46a1f15598cf1c" FOREIGN KEY ("reply_to_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_46d19cf514d5c46a1f15598cf1c"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_9e5fc47ecb06d4d7b84633b1718"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_3d623662d4ee1219b23cf61e649"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_b45b6002615900acda880360f26"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_b4129b3e21906ca57b503a1d834"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_fb3a8029a2688a74971e918df79"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "UQ_dd056fd5d6c8628fa309d1c0a37"`);
        await queryRunner.query(`DROP INDEX "public"."idx_blog_updated_at_desc"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "UQ_chat_participants_conversation_user" UNIQUE ("conversation_id", "user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_chat_messages_sender_id" ON "chat_messages" ("sender_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_chat_messages_conversation_id" ON "chat_messages" ("conversation_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_chat_participants_user_id" ON "chat_participants" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_is_read" ON "notifications" ("user_id", "is_read") `);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_user_id" ON "notifications" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_chat_messages_reply" FOREIGN KEY ("reply_to_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_chat_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_chat_messages_conversation" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_chat_participants_last_read_message" FOREIGN KEY ("last_read_message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_chat_participants_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_chat_participants_conversation" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
