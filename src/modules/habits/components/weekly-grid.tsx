/**
 * WeeklyGrid — compact 7-day completion heatmap.
 *
 * A single `HabitView` is rendered as a tiny row: 7 day cells where each cell
 * is a filled circle (completed) or empty circle (missed), one per calendar
 * day of the current week (app timezone, Asia/Kolkata).
 *
 * Pure presentational — the parent passes:
 *  - `name`        — displayed as the row label
 *  - `completedDays` — `Set<string>` of "YYYY-MM-DD" keys
 *  - `streak`      — current streak count
 */

const DAY_INITS = ["S", "M", "T", "W", "T", "F", "S"] as const;

/** App-timezone today key ("YYYY-MM-DD") — same helper as the service layer. */
function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

type WeeklyGridProps = {
  name: string;
  completedDays: Set<string>;
  streak: number;
};

export default function WeeklyGrid({ name, completedDays, streak }: WeeklyGridProps) {
  const today = todayKey();
  const parts = today.split("-");
  const [, tmRaw, tdRaw] = parts;
  const ty = Number(parts[0] ?? "2026");
  const tm = Number(tmRaw ?? "1");
  const td = Number(tdRaw ?? "1");

  // Day-of-week (0=Sun … 6=Sat) for today in the app timezone.
  // `new Date(y, m-1, d)` uses local time, which matches the timezone the
  // runtime is in — and `todayKey()` derives from that same local context.
  const todayDow = new Date(ty, tm - 1, td).getDay();

  // Walk back from today to find Sunday (start of the visible week).
  const weekStart = new Date(ty, tm - 1, td);
  weekStart.setDate(weekStart.getDate() - todayDow);

  return (
    <div className="mt-2 space-y-1">
      {/* Day-of-week header */}
      <div className="flex gap-1 pl-24">
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date(weekStart);
          d.setDate(d.getDate() + i);
          const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          const isToday = dateKey === today;
          return (
            <div
              key={dateKey}
              className={
                "flex w-7 flex-col items-center text-[9px] " +
                (isToday ? "text-foreground font-semibold" : "text-muted-foreground")
              }
            >
              {DAY_INITS[i]}
              <span className="tabular-nums">{d.getDate()}</span>
            </div>
          );
        })}
      </div>

      {/* Habit row: label + 7 circles */}
      <div className="flex items-center gap-1">
        <span
          className={
            "w-24 truncate text-[11px] " +
            (streak > 0 ? "text-foreground font-medium" : "text-muted-foreground")
          }
          title={name}
        >
          {name}
        </span>

        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date(weekStart);
          d.setDate(d.getDate() + i);
          const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          const done = completedDays.has(dateKey);
          const isToday = dateKey === today;

          const dayName = d.toLocaleDateString("en-US", {
            weekday: "long",
            timeZone: "Asia/Kolkata",
          });
          const displayDate = d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "Asia/Kolkata",
          });

          return (
            <div
              key={dateKey}
              className="flex w-7 items-center justify-center"
              title={`${dayName}, ${displayDate} — ${done ? "Completed" : "Not completed"}`}
            >
              <span
                className={
                  "block h-2 w-2 rounded-full transition-colors " +
                  (done
                    ? "bg-[--chart-2]"
                    : isToday
                      ? "border-foreground/20 border"
                      : "border-muted-foreground/30 border")
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
