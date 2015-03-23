var express = require('express');
var router = express.Router();
var rest = require('restler');
var token = process.env.ROOMIES_SECRET;
var routeHelper = require('../helpers/routeHelper');

/* Add a new expense */
router.post('/', function(req,res) {

  rest.post('http://localhost:3000/expenses', {
    data: {
            'house_id': req.param('house_id'),
            'venmo_id': req.session.venmo_id,
            'amount_string': req.param('amount_string'),
            'note': req.param('note'),
            'token': token
          }
  })
  .on('complete', function(data) {
    res.json(data);
  });
});

module.exports = router;