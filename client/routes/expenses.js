var express = require('express');
var router = express.Router();
var rest = require('restler');

/* Add a new expense */
router.post('/', function(req,res) {

  rest.post('http://localhost:3000/expenses', {
    data: {
            'house_id': req.param('house_id'),
            'venmo_id': req.session.venmo_id,
            'amount_string': req.param('amount_string'),
            'note': req.param('note')
          }
  })
  .on('complete', function(data) {
    if (data.errors) {
      req.flash('errors', data.errors)
      res.json(data);
    }
    else {
      req.flash('expense', 'Expense added!')
      res.json(data);
    }
  });
});

module.exports = router;