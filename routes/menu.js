import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/menu
// @desc    Add new menu item
router.post('/', async (req, res) => {
  const { name, price, category, description } = req.body;
  const newItem = new MenuItem({ name, price, category, description });
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
