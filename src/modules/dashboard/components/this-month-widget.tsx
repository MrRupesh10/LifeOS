// ThisMonthWidget – pure presentational component
// Receives a WidgetState<ExpenseWidgetData> and renders the month‑summary card.
// Loading, Empty, and Error states are defined inline as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type ExpenseWidgetData } from "@/modules/expenses/types";
import { Card } from "@/components/shared/card";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Internal state components – kept minimal and local per the guidelines
// -----------------------------------------------------------------------------
function Loading() {
  // Simple placeholder with animate‑pulse
  return (
    <div className="animate-pulse space-y-3">
      <div className="bg-muted h-4 w-24 rounded" />
      <div className="bg-muted h-4 w-32 rounded" />
      <div className="bg-muted h-4 w-20 rounded" />
    </div>
  );
}

function Empty() {
  // No income/expense data – friendly placeholder
  return (
    <p className="text-muted-foreground py-2 text-center text-sm">
      No financial data for this month.
    </p>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-3">
      <p className="font-medium">Failed to load financial summary</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * ThisMonthWidget – renders income, expenses and balance.
 *
 * The widget receives a {@link WidgetState}<ExpenseWidgetData> prop. All
 * calculations (summing, month‑filtering) are performed upstream in the service
 * layer; this component only formats and displays the numbers.
 */
export default function ThisMonthWidget({ state }: { state: WidgetState<ExpenseWidgetData> }) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  const data = state.data;
  if (!data) return <Empty />;

  const { incomeTotal, expenseTotal, balance } = data;

  return (
    <Card variant="hover">
      <h2 className="mb-4 text-sm font-semibold tracking-wide">This Month</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Income</span>
          <span className="text-chart-2 text-sm font-semibold tabular-nums">
            +₹{incomeTotal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Expenses</span>
          <span className="text-destructive text-sm font-semibold tabular-nums">
            −₹{expenseTotal.toLocaleString()}
          </span>
        </div>
        <div className="border-border flex items-center justify-between border-t pt-3">
          <span className="text-sm font-medium">Balance</span>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              balance >= 0 ? "text-chart-2" : "text-destructive",
            )}
          >
            ₹{balance.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
