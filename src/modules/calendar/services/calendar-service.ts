/**
 * CalendarService — business logic for the calendar module.
 */

import { type ServiceResult } from "@/lib/result";
import { type CalendarWidgetData, type CalendarWidgetEventItem } from "../types";
import {
  type CalendarDataSource,
  createCalendarDataSource,
} from "../datasource/calendar-datasource";

export async function getCalendarSummary(
  _userId: string,
  ds: CalendarDataSource = createCalendarDataSource(),
): Promise<ServiceResult<CalendarWidgetData>> {
  const result = await ds.getUpcoming(4);

  if (!result.success) return result;

  const upcoming: CalendarWidgetEventItem[] = result.data.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.startDate.slice(0, 10),
    time: e.allDay ? "All day" : e.startDate.slice(11, 16),
    allDay: e.allDay,
  }));

  return {
    success: true,
    data: { upcoming },
  };
}
