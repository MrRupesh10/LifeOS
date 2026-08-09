/**
 * Notes module types — production domain model.
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface Note {
  id: string;
  userId: string;
  title: string;
  body: string;
  tags: string[]; // freeform — user-defined labels, no join table
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Widget data slice ────────────────────────────────────────────

export interface NoteWidgetItem {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: string;
}

export interface NoteWidgetData {
  /** Most recently updated notes (max 2 on dashboard). */
  recent: NoteWidgetItem[];
  totalCount: number;
}
