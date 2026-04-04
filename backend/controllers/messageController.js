const Message = require('../models/message');
const Product = require('../models/Product');
const User = require('../models/User');

// POST /api/messages
const createMessage = async (req, res) => {
  try {
    const { productId, receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Optional product check
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ message: 'Invalid product' });
      }
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({ message: 'Invalid receiver' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      product: productId || null,
      content,
    });

    return res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/messages
// Supports:
// - GET /api/messages → all messages for logged-in user
// - GET /api/messages?userId=123 → chat between two users
const getMyMessages = async (req, res) => {
  try {
    const { userId } = req.query;

    // If userId is provided → return conversation between two users
    if (userId) {
      const messages = await Message.find({
        $or: [
          { sender: req.user._id, receiver: userId },
          { sender: userId, receiver: req.user._id }
        ]
      }).sort({ createdAt: 1 });

      return res.json(messages);
    }

    // Otherwise return all messages for inbox view
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('product', 'title')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createMessage, getMyMessages };
