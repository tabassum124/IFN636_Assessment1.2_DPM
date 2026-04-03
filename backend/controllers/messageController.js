const Message = require('../models/message');
const Product = require('../models/Product');
const User = require('../models/User');

// POST /api/messages
const createMessage = async (req, res) => {
  try {
    const { productId, receiverId, content } = req.body;

    if (!productId || !receiverId || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const product = await Product.findById(productId);
    const receiver = await User.findById(receiverId);

    if (!product || !receiver) {
      return res.status(400).json({ message: 'Invalid product or receiver' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      product: productId,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/messages
const getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('product', 'title');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createMessage, getMyMessages };
