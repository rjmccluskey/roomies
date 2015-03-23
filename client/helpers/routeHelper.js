var rest = require('restler');
var token = process.env.ROOMIES_SECRET;
var apiURI = 'http://localhost:3000';

var routeHelper = {
  get: function(router, url, params, prefix) {
    router.get(url, function(req, res) {
      if (req.session.venmo_id) {
        rest
          .get(apiURI + '/' + prefix + addParamstoURL(url, req), {
            data: getData(params, req)
          })
          .on('complete', function(data) {
            res.json(data);
          });
      }
      else {
        res.redirect('/')
      };
    });
  },
  post: function() {

  }
};

var getData = function(params, req) {
  var data = {'token': token};
  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    data[param] = req.param(param);
  };
  return data;
};

var addParamstoURL = function(url, req) {
  var urlArray = url.split("/");
  return urlArray.map(function(pathSegment) {
    if (pathSegment[0] === ":") {
      return req.param(pathSegment.substr(1));
    }
    else {
      return pathSegment;
    }
  }).join("/");
};

module.exports = routeHelper;