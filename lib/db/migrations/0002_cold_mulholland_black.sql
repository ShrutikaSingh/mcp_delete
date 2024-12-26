ALTER TABLE "User" ADD COLUMN "fullName" text;--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "firstName";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "lastName";