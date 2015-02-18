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
        req.session.user_id = data.user_id;
        req.session.access_token = data.access_token;
        res.redirect('/');
      });
  }
  else {
    res.redirect('/');
  }
});

router.get('/logout', function(req, res) {
  req.session.user_id = '';
  req.session.access_token = '';
  res.redirect('/');
})

module.exports = router;
