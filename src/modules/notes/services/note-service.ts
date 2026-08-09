/**
 * NoteService — business logic for the notes module.
 */

import { type ServiceResult } from "@/lib/result";
import { type NoteWidgetData, type NoteWidgetItem } from "../types";
import { type NoteDataSource, createNoteDataSource } from "../datasource/note-datasource";

export async function getNoteSummary(
  _userId: string,
  ds: NoteDataSource = createNoteDataSource(),
): Promise<ServiceResult<NoteWidgetData>> {
  const result = await ds.getRecent(2);

  if (!result.success) return result;

  const recent: NoteWidgetItem[] = result.data.map((n) => ({
    id: n.id,
    title: n.title,
    excerpt: n.body.slice(0, 120),
    tags: n.tags,
    updatedAt: n.updatedAt,
  }));

  return {
    success: true,
    data: {
      recent,
      totalCount: result.data.length,
    },
  };
}
