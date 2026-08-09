/**
 * Calendar module types — production domain model.
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
  allDay: boolean;
  source: CalendarEventSource;
  sourceEventId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventSource = "manual" | "sync";

// ─── Widget data slice ────────────────────────────────────────────

export interface CalendarWidgetEventItem {
  id: string;
  title: string;
  date: string; // ISO date
  time: string; // human-readable time range or "All day"
  allDay: boolean;
}

export interface CalendarWidgetData {
  /** Upcoming events displayable on the dashboard (max 4). */
  upcoming: CalendarWidgetEventItem[];
}
