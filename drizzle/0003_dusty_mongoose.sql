CREATE TABLE "tb_transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payer_id" uuid NOT NULL,
	"payee_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tb_transaction" ADD CONSTRAINT "tb_transaction_payer_id_tb_user_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."tb_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_transaction" ADD CONSTRAINT "tb_transaction_payee_id_tb_user_id_fk" FOREIGN KEY ("payee_id") REFERENCES "public"."tb_user"("id") ON DELETE no action ON UPDATE no action;