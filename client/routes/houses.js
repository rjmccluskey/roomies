var express = require('express');
var router = express.Router();
var rest = require('restler')

/* Create new house */
router.post('/', function(req,res) {
  var venmo_id = req.session.venmo_id;
  var name = req.param('name');
  var password = req.param('password');
  var password_confirmation = req.param('password_confirmation');

  rest
    .post('http://localhost:3000/houses',
      {
        data: {
                'venmo_id': venmo_id,
                'name': name,
                'password': password,
                'password_confirmation': password_confirmation
              }
      }
    )
    .on('complete', function(data) {
      console.log(data)
      if (data.errors) {
        req.flash('errors', data.errors);
        res.redirect('/');
      }
      else if (data.success) {
        req.flash('success', 'Created house: ' + name)
        res.redirect('/')
      }
    });
});

module.exports = router;