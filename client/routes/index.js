var express = require('express');
var router = express.Router();
var rest = require('restler')

router.get('/', function(req, res) {
  user_id = req.session.user_id

  if (user_id) {
    rest
      .get('http://localhost:3000/users/' + user_id)
      .on('complete', function(data) {
        if (data.error === 'User not found') {
          req.session.user_id = '';
          req.session.access_token = '';
          res.redirect('/');
        }
        else {
          res.render('show', {user: data})
        }
      });
  }
  else {
    res.render('login', { title: 'Roomies', oauth_url: 'https://api.venmo.com/v1/oauth/authorize?client_id=2373&scope=make_payments%20access_profile%20access_email%20access_phone&response_type=code' });
  }
});

module.exports = router;
