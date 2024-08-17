ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "seen" boolean DEFAULT false NOT NULL;