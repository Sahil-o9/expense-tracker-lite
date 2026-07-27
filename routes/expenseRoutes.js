const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

// Auth Middleware inline to verify user token
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized, no token' });

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed or expired' });
  }
};

// GET all expenses for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new expense
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const newExpense = new Expense({
      title,
      amount: Number(amount),
      category,
      userId: req.userId
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE expense
router.delete('/:id', protect, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;