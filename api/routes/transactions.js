import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getAccountTransactions,
  getAllTransactions,
  getExpenseTransactions,
  getIncomeTransactions,
  updateTransaction,
} from "../controllers/transactions.js";

const router = express.Router();

router.post("", createTransaction);
router.get("/all", getAllTransactions);
router.get("/:accountId", getAccountTransactions);
router.get("/:accountId/income", getIncomeTransactions);
router.get("/:accountId/expense", getExpenseTransactions);
router.patch("/:transactionId", updateTransaction);
router.delete("/:transactionId", deleteTransaction);

export default router;
