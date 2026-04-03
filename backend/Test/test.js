const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Product = require('../models/Product');
const {
  createProduct,
  updateProduct,
  getProducts,
  deleteProduct
} = require('../controllers/productController');

const { expect } = chai;

describe('Product Controller Tests', () => {

  // CREATE PRODUCT
  it('should create a new product successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        title: "Laptop",
        description: "Gaming laptop",
        price: 1200,
        category: "Electronics",
        images: ["img1.jpg"],
        location: "Brisbane"
      }
    };

    const createdProduct = { _id: new mongoose.Types.ObjectId(), ...req.body, owner: req.user.id };

    const createStub = sinon.stub(Product, 'create').resolves(createdProduct);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createProduct(req, res);

    expect(createStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdProduct)).to.be.true;

    createStub.restore();
  });

  // UPDATE PRODUCT
  it('should update a product successfully', async () => {
    const productId = new mongoose.Types.ObjectId();

    const existingProduct = {
      _id: productId,
      title: "Old Title",
      description: "Old Desc",
      price: 500,
      save: sinon.stub().resolvesThis()
    };

    const findStub = sinon.stub(Product, 'findById').resolves(existingProduct);

    const req = {
      params: { id: productId },
      body: { title: "New Title", price: 600 }
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await updateProduct(req, res);

    expect(existingProduct.title).to.equal("New Title");
    expect(existingProduct.price).to.equal(600);
    expect(res.json.calledOnce).to.be.true;

    findStub.restore();
  });

  // GET PRODUCTS
  it('should return all products', async () => {
    const products = [
      { title: "Item 1" },
      { title: "Item 2" }
    ];

    const findStub = sinon.stub(Product, 'find').resolves(products);

    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await getProducts(req, res);

    expect(findStub.calledOnce).to.be.true;
    expect(res.json.calledWith(products)).to.be.true;

    findStub.restore();
  });

  // DELETE PRODUCT
  it('should delete a product successfully', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    const product = { remove: sinon.stub().resolves() };

    const findStub = sinon.stub(Product, 'findById').resolves(product);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteProduct(req, res);

    expect(findStub.calledOnce).to.be.true;
    expect(product.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Product deleted' })).to.be.true;

    findStub.restore();
  });

});
