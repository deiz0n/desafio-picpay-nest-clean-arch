CREATE TABLE "tb_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "tb_accounts_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "tb_accounts" ADD CONSTRAINT "tb_accounts_user_id_tb_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tb_user"("id") ON DELETE cascade ON UPDATE no action;