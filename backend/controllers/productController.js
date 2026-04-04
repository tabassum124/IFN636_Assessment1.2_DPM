const Product = require('../models/Product');

// CREATE PRODUCT — POST /api/products
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, images, location } = req.body;

    // Required fields validation
    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Price validation
    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      images: images || [],
      location,
      owner: req.user._id,
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET ALL PRODUCTS — GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PRODUCT — GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT — PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only owner or admin can update
    if (
      product.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // Validate price if provided
    if (req.body.price !== undefined && req.body.price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    // Prevent empty title/description
    if (req.body.title === '') {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    if (req.body.description === '') {
      return res.status(400).json({ message: 'Description cannot be empty' });
    }

    // Update only provided fields
    const fields = ['title', 'description', 'price', 'category', 'images', 'location'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updated = await product.save();
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE PRODUCT — DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only owner or admin can delete
    if (
      product.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await product.deleteOne();
    return res.json({ message: 'Product removed' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
