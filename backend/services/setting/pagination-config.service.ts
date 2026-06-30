import { db } from "@db";
import { settings } from "@db/schema/settings";
import { sql } from "drizzle-orm";

export class PaginationConfigService {

  /**
   * Get pagination limit
   * Priority:
   * 1. value
   * 2. defaultLimit
   * 3. hard fallback = 10
   */
  static async getDefaultLimit(): Promise<number> {
    const result = await db
      .select({
        finalValue: sql<string>`COALESCE(${settings.value}, ${settings.defaultLimit})`,
      })
      .from(settings)
      .limit(1);

    return Number(result[0]?.finalValue ?? 10);
  }


  /**
   * Update value column (main override)
   */
  static async updateValue(limit: number): Promise<{ value: number }> {
    const result = await db
      .update(settings)
      .set({
        value: limit.toString(), // ✅ numeric = string in TS
      })
      .returning({ value: settings.value });

    if (!result.length) {
      await db.insert(settings).values({
        name: "Pagination Limit",
        description: "Main pagination value",
        value: limit.toString(), // ✅ string for numeric
        defaultLimit: 10,
      });
    }

    return { value: limit };
  }


  /**
   * Update defaultLimit fallback
   */
  static async updateDefaultLimit(limit: number): Promise<{ defaultLimit: number }> {
    const result = await db
      .update(settings)
      .set({
        defaultLimit: limit,
      })
      .returning({ defaultLimit: settings.defaultLimit });

    if (!result.length) {
      await db.insert(settings).values({
        name: "Pagination Default",
        description: "Fallback if value is NULL",
        defaultLimit: limit,
      });
    }

    return { defaultLimit: limit };
  }
}
