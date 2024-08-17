DROP TABLE "participants";--> statement-breakpoint
ALTER TABLE "rooms" RENAME COLUMN "user_id" TO "user1";--> statement-breakpoint
ALTER TABLE "rooms" RENAME COLUMN "is_group" TO "user2";--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "user2" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "user2" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "user2" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_user1_users_id_fk" FOREIGN KEY ("user1") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_user2_users_id_fk" FOREIGN KEY ("user2") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
