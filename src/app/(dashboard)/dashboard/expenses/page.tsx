import { DollarSign, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Clock } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { MOCK_EXPENSES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ExpensesPage() {
  const income = MOCK_EXPENSES.filter((e) => e.type === "income").reduce(
    (sum, e) => sum + e.amount,
    0,
  );
  const expenses = MOCK_EXPENSES.filter((e) => e.type === "expense").reduce(
    (sum, e) => sum + e.amount,
    0,
  );
  const balance = income - expenses;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Expenses"
        description="Simple income/expense tracking with monthly breakdowns."
        action={<Button>+ Add Transaction</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={DollarSign}
          label="Balance"
          value={`₹${balance.toLocaleString()}`}
          trend={{ direction: "up", label: "Positive" }}
        />
        <StatsCard icon={TrendingDown} label="Expenses" value={`₹${expenses.toLocaleString()}`} />
        <StatsCard icon={TrendingUp} label="Income" value={`₹${income.toLocaleString()}`} />
        <StatsCard icon={Clock} label="Transactions" value={MOCK_EXPENSES.length} />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Recent Transactions</h2>
        <div className="space-y-1.5">
          {MOCK_EXPENSES.map((tx) => (
            <div
              key={tx.id}
              className="hover:bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    tx.type === "income" ? "bg-chart-2/10" : "bg-destructive/10",
                  )}
                >
                  {tx.type === "income" ? (
                    <ArrowUp className="text-chart-2 size-4" />
                  ) : (
                    <ArrowDown className="text-destructive size-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-muted-foreground text-xs">
                    {tx.category} · {tx.date}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  tx.type === "income" ? "text-chart-2" : "text-destructive",
                )}
              >
                {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
