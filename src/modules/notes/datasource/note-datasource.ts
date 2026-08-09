/**
 * NoteDataSource — data access interface for notes.
 */

import { type ServiceResult } from "@/lib/result";
import { type Note } from "../types";
import { MOCK_NOTES, type NoteItem } from "@/lib/mock-data";

export interface NoteDataSource {
  getAll(): Promise<ServiceResult<Note[]>>;
  getRecent(limit: number): Promise<ServiceResult<Note[]>>;
}

function toDomain(mock: NoteItem): Note {
  return {
    id: mock.id,
    userId: "current-user",
    title: mock.title,
    body: mock.excerpt,
    tags: mock.tags,
    isPinned: false,
    isArchived: false,
    createdAt: "2026-07-31T00:00:00.000Z",
    updatedAt: mock.updatedAt,
  };
}

class MockNoteDataSource implements NoteDataSource {
  async getAll(): Promise<ServiceResult<Note[]>> {
    return { success: true, data: MOCK_NOTES.map(toDomain) };
  }
  async getRecent(limit: number): Promise<ServiceResult<Note[]>> {
    const sorted = [...MOCK_NOTES].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return { success: true, data: sorted.slice(0, limit).map(toDomain) };
  }
}

export const createNoteDataSource = (): NoteDataSource => new MockNoteDataSource();
