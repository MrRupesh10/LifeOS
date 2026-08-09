/**
 * ExpenseDataSource — data access interface for expense entries.
 */

import { type ServiceResult } from "@/lib/result";
import { type ExpenseEntry, type ExpenseType, type ExpenseCategory } from "../types";
import { MOCK_EXPENSES, type ExpenseItem } from "@/lib/mock-data";

export interface ExpenseDataSource {
  getAll(): Promise<ServiceResult<ExpenseEntry[]>>;
  getByType(type: ExpenseType): Promise<ServiceResult<ExpenseEntry[]>>;
}

function toDomain(mock: ExpenseItem): ExpenseEntry {
  return {
    id: mock.id,
    userId: "current-user",
    title: mock.description,
    amount: mock.amount,
    type: mock.type as ExpenseType,
    category: (mock.category ?? "other") as ExpenseCategory,
    date: mock.date,
    notes: null,
    createdAt: "2026-07-31T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
  };
}

class MockExpenseDataSource implements ExpenseDataSource {
  async getAll(): Promise<ServiceResult<ExpenseEntry[]>> {
    return { success: true, data: MOCK_EXPENSES.map(toDomain) };
  }
  async getByType(type: ExpenseType): Promise<ServiceResult<ExpenseEntry[]>> {
    return { success: true, data: MOCK_EXPENSES.filter((e) => e.type === type).map(toDomain) };
  }
}

export const createExpenseDataSource = (): ExpenseDataSource => new MockExpenseDataSource();
