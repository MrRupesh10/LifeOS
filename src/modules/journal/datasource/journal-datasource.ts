/**
 * JournalDataSource — data access interface for journal entries.
 */

import { type ServiceResult } from "@/lib/result";
import { type JournalEntry, type JournalMood } from "../types";
import { MOCK_JOURNAL, type JournalEntry as MockJournalEntry } from "@/lib/mock-data";

export interface JournalDataSource {
  getAll(): Promise<ServiceResult<JournalEntry[]>>;
  getRecent(limit: number): Promise<ServiceResult<JournalEntry[]>>;
}

function toDomain(mock: MockJournalEntry): JournalEntry {
  return {
    id: mock.id,
    userId: "current-user",
    title: mock.title,
    body: mock.excerpt,
    mood: mock.mood as JournalMood,
    entryDate: mock.date,
    createdAt: "2026-07-31T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
  };
}

class MockJournalDataSource implements JournalDataSource {
  async getAll(): Promise<ServiceResult<JournalEntry[]>> {
    return { success: true, data: MOCK_JOURNAL.map(toDomain) };
  }
  async getRecent(limit: number): Promise<ServiceResult<JournalEntry[]>> {
    return { success: true, data: MOCK_JOURNAL.slice(0, limit).map(toDomain) };
  }
}

export const createJournalDataSource = (): JournalDataSource => new MockJournalDataSource();
