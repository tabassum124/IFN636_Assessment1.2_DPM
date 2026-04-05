const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Message = require("../models/message");
const Product = require("../models/Product");
const User = require("../models/User");
const { createMessage } = require("../controllers/messageController");
const { expect } = chai;

afterEach(() => sinon.restore());

describe("Create Message Test", () => {
  it("should send a message successfully", async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        productId: new mongoose.Types.ObjectId(),
        receiverId: new mongoose.Types.ObjectId(),
        content: "Hello!"
      }
    };

    // Stub product check
    sinon.stub(Product, "findById").resolves({ _id: req.body.productId });

    // Stub receiver check
    sinon.stub(User, "findById").resolves({ _id: req.body.receiverId });

    // Stub message creation
    const createdMessage = {
      sender: req.user._id,
      receiver: req.body.receiverId,
      product: req.body.productId,
      content: req.body.content
    };

    sinon.stub(Message, "create").resolves(createdMessage);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createMessage(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdMessage)).to.be.true;
  });

  it("should return 500 on error", async () => {
    // Force Message.create to throw error
    sinon.stub(Product, "findById").resolves({});
    sinon.stub(User, "findById").resolves({});
    sinon.stub(Message, "create").throws(new Error("DB Error"));

    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        receiverId: new mongoose.Types.ObjectId(),
        content: "Hi"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createMessage(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWithMatch({ message: "Server error" })
    ).to.be.true;
  });
});
