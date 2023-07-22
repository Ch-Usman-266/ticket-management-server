const express = require('express');
const { authToken } = require('../../middlewares');
const { ticketController } = require('../../controllers');

const router = express.Router();

router.get('/', authToken, ticketController.getAllTickets);
router.get('/:id', authToken, ticketController.getATicket);
router.post('/', authToken, ticketController.createTicket);
router.patch('/:id', authToken, ticketController.updateTicket);
router.patch('/:id/status', authToken, ticketController.updateStatus);
router.delete('/:id', authToken, ticketController.deleteTicket);

module.exports = router;
