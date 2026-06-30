import { integer, pgTable, serial, varchar, text, numeric } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name", { length: 100 }).notNull(),

  description: text("description"),

  // ✅ MUST allow null (to use defaultLimit)
  value: numeric("value", { precision: 10, scale: 2 }),

  // fallback when value is null
  defaultLimit: integer("default_limit").default(10).notNull(),
});
