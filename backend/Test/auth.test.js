const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const User = require("../models/User");
const { registerUser } = require("../controllers/authController");
const { expect } = chai;

afterEach(() => sinon.restore());

describe("Register User Test", () => {
  it("should register a user successfully", async () => {
    const req = {
      body: { name: "Test", email: "test@example.com", password: "123456" }
    };

    // Your controller checks email first
    sinon.stub(User, "findOne").resolves(null);

    // Then creates user
    sinon.stub(User, "create").resolves({
      id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email
    });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await registerUser(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should return 500 on error", async () => {
    // Force findOne to throw error
    sinon.stub(User, "findOne").throws(new Error("DB Error"));

    const req = { body: { email: "x" } };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await registerUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
  });
});
