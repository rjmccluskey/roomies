var express = require('express');
var router = express.Router();
var rest = require('restler');

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
      res.redirect('/houses/' + house_id);
    }
    else {
      req.flash('expense', 'Expense added!')
      res.redirect('/houses/' + house_id);
    }
  });
});

module.exports = router;