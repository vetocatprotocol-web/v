CREATE TABLE IF NOT EXISTS "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"type" "agent_type" DEFAULT 'custom' NOT NULL,
	"version" varchar(20) DEFAULT '1.0.0' NOT NULL,
	"status" "agent_status" DEFAULT 'active' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"permissions" text[] DEFAULT ,
	"price_per_execution" numeric(10, 4) DEFAULT '0',
	"is_marketplace" boolean DEFAULT false,
	"category" varchar(50),
	"creator_id" uuid,
	"rating" numeric(3, 2) DEFAULT '0',
	"rating_count" integer DEFAULT 0,
	"execution_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "agents_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agents" ADD CONSTRAINT "agents_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
