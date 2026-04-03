const express = require('express');
const router = express.Router();
const { createMessage, getMyMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createMessage)
  .get(protect, getMyMessages);

module.exports = router;
