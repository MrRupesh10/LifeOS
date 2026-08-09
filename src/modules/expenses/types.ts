/**
 * Expenses module types — production domain model.
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface ExpenseEntry {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: ExpenseType;
  category: ExpenseCategory;
  date: string; // ISO date — the day this transaction occurred
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseType = "expense" | "income";

export type ExpenseCategory =
  | "food"
  | "transport"
  | "entertainment"
  | "bills"
  | "shopping"
  | "health"
  | "education"
  | "salary"
  | "freelance"
  | "other";

// ─── Widget data slice ────────────────────────────────────────────

export interface ExpenseWidgetData {
  /** Sum of all income entries this month. */
  incomeTotal: number;
  /** Sum of all expense entries this month. */
  expenseTotal: number;
  /** incomeTotal - expenseTotal */
  balance: number;
}
