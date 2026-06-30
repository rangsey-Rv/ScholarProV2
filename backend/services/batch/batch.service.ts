import { db } from '@db';
import { batches } from '@db/schema/batch';
import { eq } from 'drizzle-orm';
import { createBatchSchema, updateBatchSchema } from '@validation/batch.schema';

export const getAllBatches = async () => {
    const allBatches = await db.select().from(batches);
    return {
        success: true,
        data: allBatches
    };
};

export const getBatchById = async (id: number) => {
    const batch = await db.select().from(batches).where(eq(batches.id, id));

    if (batch.length === 0) {
        return { success: false, msg: "Batch not found" };
    }

    return {
        success: true,
        data: batch[0]
    };
};

export const createBatch = async (batchPayload: unknown) => {
    const parsed = createBatchSchema.safeParse(batchPayload);
    if (!parsed.success) {
        return { success: false, msg: "Validation error" };
    }

    const newBatch = await db.insert(batches).values({
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
    }).returning();

    if (newBatch.length === 0) {
        return { success: false, msg: "Failed to create batch" };
    }

    return {
        success: true,
        msg: "Batch created successfully",
        data: newBatch[0]
    };
};

export const updateBatch = async (id: number, batchPayload: unknown) => {
    const parsed = updateBatchSchema.safeParse(batchPayload);
    if (!parsed.success) {
        return { success: false, msg: "Validation error" };
    }

    const batch = await db.select().from(batches).where(eq(batches.id, id));

    if (batch.length === 0) {
        return { success: false, msg: "Batch not found" };
    }

    const updatedBatch = await db.update(batches).set(parsed.data).where(eq(batches.id, id)).returning();

    if (updatedBatch.length === 0) {
        return { success: false, msg: "Failed to update batch" };
    }

    return {
        success: true,
        msg: "Batch updated successfully",
        data: updatedBatch[0]
    };
};