import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const artifacts = sqliteTable("artifacts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  metadata: text("metadata"),
  tags: text("tags"),
  filePath: text("file_path"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const actionItems = sqliteTable("action_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artifactId: text("artifact_id")
    .notNull()
    .references(() => artifacts.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  status: text("status").default("pending"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  assignedTo: text("assigned_to"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
