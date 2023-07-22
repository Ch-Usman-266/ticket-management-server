const { expect } = require('chai');
const sinon = require('sinon');
const db = require('../models');
const { ticketController } = require('../controllers');

const { Ticket } = db;

describe('Tickets Controller', () => {
  before(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Ticket.destroy({ where: {} });
  });

  describe('Get', () => {
    it('should retrieve all tickets for an admin user', async () => {
      const req = { userRole: 'admin', userId: 1 };
      const tickets = [
        {
          id: 1,
          name: 'Ticket 1',
          email: 'JohnDoe@example.com',
          description: 'This is Ticket 1',
          status: 'New',
          creatorId: 1,
          creator: { name: 'John', email: 'john@example.com' },
        },
        {
          id: 2,
          name: 'Ticket 2',
          email: 'JohnDoe@example.com',
          description: 'This is Ticket 2',
          status: 'New',
          creatorId: 1,
          creator: { name: 'John', email: 'john@example.com' },
        },
      ];

      const findAllStub = sinon.stub(Ticket, 'findAll').resolves(tickets);

      const res = {
        status(statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json(data) {
          this.data = data;
        },
      };

      await ticketController.getAllTickets(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.deep.equal({
        status: 'success',
        message: 'Tickets retrieved successfully',
        payload: tickets,
      });
    });

    it('should retrieve tickets for a user', async () => {
      const req = { userRole: 'admin', userId: 1, params: { id: 1 } };
      const tickets = [
        {
          id: 1,
          name: 'Ticket 1',
          email: 'JohnDoe@example.com',
          description: 'This is Ticket 1',
          status: 'New',
          creatorId: 1,
          creator: { name: 'John', email: 'john@example.com' },
        },
        {
          id: 2,
          name: 'Ticket 2',
          email: 'JohnDoe@example.com',
          description: 'This is Ticket 2',
          status: 'New',
          creatorId: 1,
          creator: { name: 'John', email: 'john@example.com' },
        },
      ];

      const findAllStub = sinon.stub(Ticket, 'findByPk').resolves(tickets);

      const res = {
        status(statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json(data) {
          this.data = data;
        },
      };

      await ticketController.getATicket(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.deep.equal({
        status: 'success',
        message: 'Ticket retrieved successfully',
        payload: tickets,
      });

      findAllStub.restore();
    });
  });
});
