/**
 * JournalService — business logic for the journal module.
 */

import { type ServiceResult } from "@/lib/result";
import { type JournalWidgetData, type JournalEntryWidgetItem } from "../types";
import { type JournalDataSource, createJournalDataSource } from "../datasource/journal-datasource";

export async function getJournalSummary(
  _userId: string,
  ds: JournalDataSource = createJournalDataSource(),
): Promise<ServiceResult<JournalWidgetData>> {
  const result = await ds.getRecent(2);

  if (!result.success) return result;

  const recent: JournalEntryWidgetItem[] = result.data.map((e) => ({
    id: e.id,
    title: e.title,
    excerpt: e.body.slice(0, 120),
    mood: e.mood,
    date: e.entryDate,
  }));

  return {
    success: true,
    data: {
      recent,
      totalCount: recent.length,
    },
  };
}
