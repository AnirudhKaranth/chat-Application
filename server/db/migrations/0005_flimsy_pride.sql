ALTER TABLE "messages" ALTER COLUMN "createdAt" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "createdAt" integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" integer DEFAULT CURRENT_TIMESTAMP NOT NULL;