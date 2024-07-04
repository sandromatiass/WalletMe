export interface Expense {
  id: string;
  description: string;
  amount: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}