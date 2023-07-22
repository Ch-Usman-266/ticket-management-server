const db = require('../../models');

const { Ticket, User } = db;

const getAllTickets = async (req, res) => {
  try {
    let payload;
    if (req.userRole === 'admin') {
      payload = await Ticket.findAll({
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['name', 'email'],
          },
        ],
      });
    } else if (req.userRole === 'user') {
      payload = await Ticket.findAll({
        where: { creatorId: req.userId },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['name', 'email'],
          },
        ],
      });
    } else {
      // Handle other user roles or unexpected cases
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: Invalid user role',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Tickets retrieved successfully',
      payload,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to retrieve tickets', error });
  }
};

const getATicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Ticket not found' });
    }

    if (req.userRole === 'admin') {
      return res.status(200).json({
        status: 'success',
        message: 'Ticket retrieved successfully',
        payload: ticket,
      });
    }

    if (ticket.creatorId === req.userId) {
      return res.status(200).json({
        status: 'success',
        message: 'Ticket retrieved successfully',
        payload: ticket,
      });
    }
    return res.status(403).json({
      status: 'error',
      message: 'Access denied: You are not allowed to view this ticket',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve the ticket',
      error,
    });
  }
};

const createTicket = async (req, res) => {
  const { name, email, description, creatorId } = req.body;
  try {
    const newTicket = await Ticket.create({
      name,
      email,
      description,
      creatorId,
    });
    res.status(201).json({
      status: 'success',
      message: 'Ticket created successfully',
      payload: newTicket,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create a new ticket',
      error,
    });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Ticket not found' });
    }

    const { status: currentStatus } = ticket;
    const { status: newStatus } = req.body;

    const allowedTransitions = {
      new: ['in_progress'],
      in_progress: ['resolved'],
      resolved: [],
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status transition',
        allowedTransitions: allowedTransitions[currentStatus] || [],
      });
    }

    if (newStatus === 'resolved' && req.userRole !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message:
          'Access denied: You are not allowed to set the status to resolved',
      });
    }

    await ticket.update({ status: newStatus });

    return res.status(200).json({
      status: 'success',
      message: 'Ticket updated successfully',
      payload: ticket,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update the ticket',
      error,
    });
  }
};

const updateTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Ticket not found' });
    }

    if (req.userRole === 'admin') {
      await ticket.update(req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Ticket updated successfully',
        payload: ticket,
      });
    }

    if (ticket.creatorId === req.userId) {
      await ticket.update(req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Ticket updated successfully',
        payload: ticket,
      });
    }
    return res.status(403).json({
      status: 'error',
      message: 'Access denied: You are not allowed to update this ticket',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update the ticket',
      error,
    });
  }
};

const deleteTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Ticket not found' });
    }

    if (req.userRole === 'admin') {
      await ticket.destroy();

      return res.status(200).json({
        status: 'success',
        message: 'Ticket deleted successfully',
      });
    }

    if (ticket.creatorId === req.userId) {
      await ticket.destroy();

      return res.status(200).json({
        status: 'success',
        message: 'Ticket deleted successfully',
      });
    }
    return res.status(403).json({
      status: 'error',
      message: 'Access denied: You are not allowed to delete this ticket',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete the ticket',
      error,
    });
  }
};

module.exports = {
  getAllTickets,
  getATicket,
  createTicket,
  updateTicket,
  updateStatus,
  deleteTicket,
};
