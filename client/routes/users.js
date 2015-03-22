var express = require('express');
var router = express.Router();
var rest = require('restler');
var headers = {'Authentication': 'Token token=' + process.env.ROOMIES_SECRET};

router.get('/venmo_oauth', function(req, res) {
  var code = req.query.code;

  if (code) {
    rest
      .post('http://localhost:3000/users',
        { data: {'code': code},
        headers: headers
      })
      .on('complete', function(data) {
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

router.get('/', function(req,res) {
  var venmo_id = req.session.venmo_id;

  if (venmo_id) {
    rest
      .get('http://localhost:3000/users/' + venmo_id, {
        headers: headers
      })
      .on('complete', function(data) {
        if (data.error) {
          res.redirect('/')
        }
        else {
          res.json(data);
        }
      });
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;
