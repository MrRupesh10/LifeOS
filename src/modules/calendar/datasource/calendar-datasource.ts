/**
 * CalendarDataSource — data access interface for calendar events.
 */

import { type ServiceResult } from "@/lib/result";
import { type CalendarEvent, type CalendarEventSource } from "../types";
import { MOCK_EVENTS, type CalendarEvent as MockCalendarEvent } from "@/lib/mock-data";

export interface CalendarDataSource {
  getAll(): Promise<ServiceResult<CalendarEvent[]>>;
  getUpcoming(limit: number): Promise<ServiceResult<CalendarEvent[]>>;
}

function toDomain(mock: MockCalendarEvent): CalendarEvent {
  return {
    id: mock.id,
    userId: "current-user",
    title: mock.title,
    description: null,
    startDate: `${mock.date}T${mock.time ?? "00:00"}:00.000Z`,
    endDate: `${mock.date}T23:59:00.000Z`,
    allDay: false,
    source: "manual" as CalendarEventSource,
    sourceEventId: null,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
  };
}

class MockCalendarDataSource implements CalendarDataSource {
  async getAll(): Promise<ServiceResult<CalendarEvent[]>> {
    return { success: true, data: MOCK_EVENTS.map(toDomain) };
  }
  async getUpcoming(limit: number): Promise<ServiceResult<CalendarEvent[]>> {
    return { success: true, data: MOCK_EVENTS.slice(0, limit).map(toDomain) };
  }
}

export const createCalendarDataSource = (): CalendarDataSource => new MockCalendarDataSource();
