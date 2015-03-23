var express = require('express');
var router = express.Router();
var routeHelper = require('../helpers/routeHelper');

/* Show a house */
routeHelper.get(router, '/:house_id', [], 'houses');

/* Show a house's expenses */
routeHelper.get(router, '/:house_id/expenses', [], 'houses');

/* Create new house */
routeHelper.post(router, '/', ['name', 'password', 'password_confirmation'], 'houses', true);

/* Join a house */
routeHelper.post(router, '/:house_id/join', ['password'], 'houses', true);

module.exports = router;