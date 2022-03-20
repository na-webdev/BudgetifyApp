import Transaction from "../models/transaction.js";

export const getAccountTransactions = async (req, res) => {
  let { accountId } = req.params;
  let transactions = await Transaction.find({ accountId: accountId });
  res.json({
    message: "All account transactions",
    transactions,
  });
};

export const getIncomeTransactions = async (req, res) => {
  let { accountId } = req.params;
  let transactions = await Transaction.find({ accountId: accountId }).where({
    type: "income",
  });
  res.json({
    message: "Income transactions",
    transactions,
  });
};

export const getExpenseTransactions = async (req, res) => {
  let { accountId } = req.params;
  let transactions = await Transaction.find({ accountId: accountId }).where({
    type: "expense",
  });
  res.json({
    message: "Expense transactions",
    transactions,
  });
};

export const updateTransaction = async (req, res) => {
  let { transactionId } = req.params;
  let updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: transactionId },
    req.body,
    { new: true, runValidators: true }
  );
  res.json({
    message: "Transaction updated",
    updatedTransaction,
  });
};

export const deleteTransaction = async (req, res) => {
  let { transactionId } = req.params;
  let deletedTransaction = await Transaction.findOneAndRemove({
    _id: transactionId,
  });
  res.json({
    message: "Transaction deleted",
    deletedTransaction,
  });
};