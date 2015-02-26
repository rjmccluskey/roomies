var express = require('express');
var router = express.Router();
var rest = require('restler')

router.get('/venmo_oauth', function(req, res) {
  var code = req.query.code;

  if (code) {
    rest
      .post('http://localhost:3000/users',
        { data: {'code': code} })
      .on('complete', function(data) {
        console.log(data);
        if (data.error) {
          req.flash('venmo_error', data.error);
          res.redirect('/');
        }
        else {

          req.session.venmo_id = data.user.venmo_id;
          res.redirect('/');
        }
      });
  }
  else {
    res.redirect('/');
  }
});

router.get('/:venmo_id', function(req,res) {
  if (req.session.venmo_id) {
    rest
      .get('http://localhost:3000/users/' + req.param('venmo_id'))
      .on('complete', function(data) {
        if (data.error) {
          res.redirect('/')
        }
        else {
          res.render('user', data)
        }
      });
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;
