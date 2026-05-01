CREATE TYPE "public"."user_role" AS ENUM('CUSTOMER', 'MERCHANT');--> statement-breakpoint
CREATE TABLE "tb_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullName" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" "user_role" DEFAULT 'CUSTOMER',
	"cpf" varchar,
	"cnpj" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "tb_user_email_unique" UNIQUE("email"),
	CONSTRAINT "tb_user_cpf_unique" UNIQUE("cpf"),
	CONSTRAINT "tb_user_cnpj_unique" UNIQUE("cnpj")
);
