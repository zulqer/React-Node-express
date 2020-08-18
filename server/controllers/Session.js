var Session = require("../models/Session");
var User = require("../models/User");

var response = {
    error: false,
    status: "",
    data: null,
    userMessage: ""
  };
  var session = {};

  var NullResponseValue = function () {
    response = {
      error: false,
      status: "",
      data: null,
      userMessage: "",
      errors: null
    };
    return true;
  };
  var SendResponse = function (res, status) {
    response.status = status || response.status || 200;
    res.status(status || 200).send(response);
    NullResponseValue();
    return;
  };
session.checkToken = function (req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      var bearer = bearerHeader.split(" ");
      bearerToken = bearer[1];
      req.token = bearerToken;
    }
    var token = bearerToken || req.body.token || req.query.token || req.query.authToken;
    Session.findOne({
        authToken: token
      })
      .lean()
      .exec(function (err, session) {
        if (err || !session) {
          response.userMessage = "Your session has been expired. Please login again.";
          return SendResponse(res, 401);
        } else {
          User.findOne({
              _id: session.userId
            })
            
            .exec(function (err, user) {
              if (err || !user) {
                response.userMessage = "Your session has been expired. Please login again.";
                return SendResponse(res, 401);
              } else {
                req.token = token;
                req.user = user;
                next();
              }
            });
        }
      });
  };

  module.exports = session;