ALTER TABLE "tb_accounts" RENAME TO "tb_account";--> statement-breakpoint
ALTER TABLE "tb_account" DROP CONSTRAINT "tb_accounts_user_id_unique";--> statement-breakpoint
ALTER TABLE "tb_account" DROP CONSTRAINT "tb_accounts_user_id_tb_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tb_account" ADD CONSTRAINT "tb_account_user_id_tb_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tb_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_account" ADD CONSTRAINT "tb_account_user_id_unique" UNIQUE("user_id");