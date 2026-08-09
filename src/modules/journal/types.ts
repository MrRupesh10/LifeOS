/**
 * Journal module types — production domain model.
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  body: string;
  /** Mood is optional — user may skip it on a given day. */
  mood: JournalMood | null;
  entryDate: string; // ISO date — the day this entry belongs to
  createdAt: string;
  updatedAt: string;
}

export type JournalMood = "great" | "good" | "neutral" | "low";

// ─── Widget data slice ────────────────────────────────────────────

export interface JournalEntryWidgetItem {
  id: string;
  title: string;
  excerpt: string;
  mood: JournalMood | null;
  date: string;
}

export interface JournalWidgetData {
  /** Most recent entries (max 2 on dashboard). */
  recent: JournalEntryWidgetItem[];
  totalCount: number;
}
