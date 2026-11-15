ALTER TABLE "site_sections" ADD COLUMN "data" jsonb;--> statement-breakpoint
ALTER TABLE "site_sections" ADD COLUMN "visible" boolean DEFAULT true NOT NULL;