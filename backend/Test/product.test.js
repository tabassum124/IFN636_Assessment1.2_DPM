const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { createProduct } = require("../controllers/productController");
const { expect } = chai;

afterEach(() => sinon.restore());

describe("Create Product Function Test", () => {
  it("should create a new product successfully", async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        title: "Laptop",
        description: "Good condition",
        price: 500,
        category: "Electronics",
        images: ["img1.jpg"],
        location: "Brisbane"
      }
    };

    const createdProduct = {
      ...req.body,
      owner: req.user._id
    };

    sinon.stub(Product, "create").resolves(createdProduct);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createProduct(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdProduct)).to.be.true;
  });

  it("should return 400 if required fields are missing", async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: { title: "", description: "", price: undefined, category: "" }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createProduct(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Missing required fields" })).to.be.true;
  });

  it("should return 400 if price is negative", async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        title: "Laptop",
        description: "Good",
        price: -10,
        category: "Electronics"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createProduct(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Price cannot be negative" })).to.be.true;
  });

  it("should return 500 if Product.create throws an error", async () => {
    sinon.stub(Product, "create").throws(new Error("DB Error"));

    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        title: "Laptop",
        description: "Good",
        price: 500,
        category: "Electronics"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createProduct(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
  });
});
