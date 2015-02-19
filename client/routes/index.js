var express = require('express');
var router = express.Router();
var rest = require('restler')

router.get('/', function(req, res) {
  venmo_id = req.session.venmo_id

  if (venmo_id) {
    rest
      .get('http://localhost:3000/users/' + venmo_id)
      .on('complete', function(data) {
        if (data.error === 'User not found') {
          req.session.venmo_id = '';
          req.session.access_token = '';
          res.redirect('/');
        }
        else {
          res.render('index', {user: data.user, houses: data.houses})
        }
      });
  }
  else {
    res.render('login', { title: 'Roomies', oauth_url: 'https://api.venmo.com/v1/oauth/authorize?client_id=2373&scope=make_payments%20access_profile%20access_email%20access_phone&response_type=code' });
  }
});

module.exports = router;
