const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { expect } = require('chai');
const sinon = require('sinon');
const db = require('../models');
const { authController } = require('../controllers');

const { User } = db;

describe('Authentication Controller', () => {
  before(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('register', () => {
    it('should register a new user and return a success response', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'securePassword',
          role: 'user',
        },
      };
      const res = {
        status(statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json(data) {
          this.data = data;
        },
      };

      await authController.register(req, res);

      expect(res.statusCode).to.equal(201);
      expect(res.data).to.have.property('status', 'success');
      expect(res.data).to.have.property('payload');
      expect(res.data.payload).to.have.property('name', req.body.name);
      expect(res.data.payload).to.have.property('email', req.body.email);
      expect(res.data.payload).to.have.property('role', req.body.role);
    });

    it('should handle registration failure and return an error response', async () => {
      const createStub = sinon
        .stub(User, 'create')
        .throws(new Error('Database connection failed'));

      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'securePassword',
          role: 'user',
        },
      };
      const res = {
        status(statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json(data) {
          this.data = data;
        },
      };

      await authController.register(req, res);

      expect(res.statusCode).to.equal(500);
      expect(res.data).to.have.property('status', 'error');
      expect(res.data).to.have.property('message', 'Failed to register user');
      expect(res.data).to.have.property('error');
      expect(res.data.error).to.be.an.instanceOf(Error);
      expect(res.data.error.message).to.equal('Database connection failed');

      createStub.restore();
    });
  });

  describe('signIn', () => {
    it('should log in a user and return a success response with a JWT token', async () => {
      const userEmail = 'john@example.com';
      const userPassword = 'securePassword';
      const user = {
        id: 1,
        name: 'John Doe',
        email: userEmail,
        password: await bcrypt.hash(userPassword, 10),
        role: 'user',
      };

      const findOneStub = sinon.stub(User, 'findOne').returns(user);

      const req = {
        body: {
          email: userEmail,
          password: userPassword,
        },
      };
      const res = {
        status(statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json(data) {
          this.data = data;
        },
      };

      await authController.signIn(req, res);

      // Ensure that the status and json methods were called with the correct arguments
      expect(res.statusCode).to.equal(200);
      expect(res.data).to.have.property('status', 'success');
      expect(res.data).to.have.property('payload');
      expect(res.data.payload).to.have.property('token');

      // Restore the original User.findOne method
      findOneStub.restore();
    });

    it('should handle login failure when provided password is incorrect and return an error response', async () => {
      const userEmail = 'john@example.com';
      const userPassword = 'securePassword';
      const user = {
        id: 1,
        name: 'John Doe',
        email: userEmail,
        password: await bcrypt.hash(userPassword, 10),
        role: 'user',
      };

      const findOneStub = sinon.stub(User, 'findOne').returns(user);

      const req = {
        body: {
          email: userEmail,
          password: 'incorrectPassword',
        },
      };
      const res = {
        status(statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json(data) {
          this.data = data;
        },
      };

      await authController.signIn(req, res);

      expect(res.statusCode).to.equal(401);
      expect(res.data).to.have.property('status', 'error');
      expect(res.data).to.have.property('message', 'Invalid credentials');

      findOneStub.restore();
    });
  });
});
