const express = require('express');
const ticketRoutes = require('./ticket/ticket.routes');
const authRoutes = require('./auth/auth.routes');

const router = express.Router();

const routes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/tickets',
    route: ticketRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
