import { db } from "@db";
import { attachments } from "@db/schema/attachment";
import { InternalServerError } from "@utils/errors";
import { eq } from "drizzle-orm";

export class AttachmentService {
  static async createAttachments(
    files: Express.Multer.File[],
    type: string
  ): Promise<number[]> {
    if (!files || files.length === 0) {
      return [];
    }

    try {
      const attachmentRecords = files.map((file) => ({
        type,
        fileUrl: `/public/image/${file.filename}`,
      }));

      const createdAttachments = await db
        .insert(attachments)
        .values(attachmentRecords)
        .returning();

      return createdAttachments.map((attachment) => attachment.id);
    } catch (error) {
      throw new InternalServerError(
        `Failed to create attachment records: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async createAttachment(
    file: Express.Multer.File,
    type: string
  ): Promise<number> {
    const [attachmentId] = await this.createAttachments([file], type);
    return attachmentId;
  }

  static async getById(id: number) {
    const [attachment] = await db
      .select()
      .from(attachments)
      .where(eq(attachments.id, id))
      .limit(1);

    return attachment;
  }
}
