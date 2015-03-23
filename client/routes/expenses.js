var express = require('express');
var router = express.Router();
var routeHelper = require('../helpers/routeHelper');

/* Add a new expense */
routeHelper.post(router, '/', ['house_id', 'amount_string', 'note'], 'expenses', true);

module.exports = router;