import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const eventLogs = pgTable("event_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  event: text("event").notNull(),
  element: text("element").notNull(),
  data: jsonb("data"),
  userAgent: text("user_agent"),
  viewport: text("viewport"),
  url: text("url"),
});

export const generationRequests = pgTable("generation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskType: text("task_type").notNull(),
  speed: text("speed"),
  prompt: text("prompt").notNull(),
  aspectRatio: text("aspect_ratio"),
  hasUploadedImage: boolean("has_uploaded_image").default(false),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  resultUrl: text("result_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEventLogSchema = createInsertSchema(eventLogs).omit({
  id: true,
  timestamp: true,
});

export const insertGenerationRequestSchema = createInsertSchema(generationRequests).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  status: true,
}).extend({
  prompt: z.string().min(50, "Prompt must be at least 50 characters"),
  taskType: z.enum(["image", "video"]),
  speed: z.enum(["slow", "normal", "fast"]).optional(),
  aspectRatio: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type EventLog = typeof eventLogs.$inferSelect;
export type InsertEventLog = z.infer<typeof insertEventLogSchema>;
export type GenerationRequest = typeof generationRequests.$inferSelect;
export type InsertGenerationRequest = z.infer<typeof insertGenerationRequestSchema>;
