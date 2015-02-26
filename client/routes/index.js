var express = require('express');
var router = express.Router();
var rest = require('restler')

// router.get('/', function(req, res) {
//   venmo_id = req.session.venmo_id

//   if (venmo_id) {
//     rest
//       .get('http://localhost:3000/users/' + venmo_id)
//       .on('complete', function(data) {
//         if (data.error === 'User not found') {
//           req.session.venmo_id = '';
//           req.session.access_token = '';
//           res.redirect('/');
//         }
//         else {
//           res.render('index', data)
//         }
//       });
//   }
//   else {
//     res.render('login', { title: 'Roomies', oauth_url: 'https://api.venmo.com/v1/oauth/authorize?client_id=2373&scope=make_payments%20access_profile%20access_email%20access_phone&response_type=code' });
//   }
// });

router.get('/search_form', function(req,res) {
  if (req.session.venmo_id) {
    res.render('search');
  }
  else {
    res.redirect('/');
  }
});

router.get('/search', function(req,res) {
  if (req.session.venmo_id) {
    rest
      .get('http://localhost:3000/users/search', {
        data: {search: req.param('search')}
      })
      .on('complete', function(data) {
        var error = data.error;

        if (error) {
          req.flash('error', error);
          res.render('search');
        }
        else {
          res.render('search', data);
        }
      });
  }
  else {
    res.redirect('/')
  }
});

router.get('/logout', function(req, res) {
  req.session.venmo_id = '';
  req.session.access_token = '';
  res.redirect('/');
});

router.get('*', function(req,res) {
  res.sendfile('./public/index.html')
});

module.exports = router;
