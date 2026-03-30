CREATE TABLE IF NOT EXISTS "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"type" "task_type" DEFAULT 'manual' NOT NULL,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"priority" "task_priority" DEFAULT 'medium' NOT NULL,
	"input" jsonb DEFAULT '{}'::jsonb,
	"output" jsonb,
	"agent_id" uuid,
	"assigned_to" uuid,
	"progress" integer DEFAULT 0,
	"error" jsonb,
	"cost_usd" numeric(10, 6) DEFAULT '0',
	"model_used" varchar(100),
	"tokens_input" integer DEFAULT 0,
	"tokens_output" integer DEFAULT 0,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
