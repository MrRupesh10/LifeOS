/**
 * ExpenseService — business logic for the expenses module.
 */

import { type ServiceResult } from "@/lib/result";
import { type ExpenseWidgetData } from "../types";
import { type ExpenseDataSource, createExpenseDataSource } from "../datasource/expense-datasource";

export async function getExpenseSummary(
  _userId: string,
  ds: ExpenseDataSource = createExpenseDataSource(),
): Promise<ServiceResult<ExpenseWidgetData>> {
  const [incomeResult, expenseResult] = await Promise.all([
    ds.getByType("income"),
    ds.getByType("expense"),
  ]);

  if (!incomeResult.success) return incomeResult;
  if (!expenseResult.success) return expenseResult;

  const incomeTotal = incomeResult.data.reduce((sum, e) => sum + e.amount, 0);
  const expenseTotal = expenseResult.data.reduce((sum, e) => sum + e.amount, 0);

  return {
    success: true,
    data: {
      incomeTotal,
      expenseTotal,
      balance: incomeTotal - expenseTotal,
    },
  };
}
