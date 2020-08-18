var mongoose = require("mongoose");
var cryptography = require("../libs/cryptography");
var jwt = require("jsonwebtoken");
var User = require("../models/User");
var Session = require("../models/Session");
var config = require("../config/config");
var response = {
  error: false,
  status: 200,
  data: null,
  userMessage: "",
  errors: null,
};

var NullResponseValue = function () {
  response = {
    error: false,
    status: 200,
    data: null,
    userMessage: "",
    errors: null,
  };
  return true;
};
var SendResponse = function (res, status) {
  res.status(status || 200).send(response);
  NullResponseValue();
  return;
};

var userController = {};

userController.signup = function (req, res) {
    // console.log(req.body)
  req.checkBody("name", "name is required.").notEmpty();
  req.checkBody("email", "email is required.").notEmpty();
  req.checkBody("password", "password is required.").notEmpty();
  var errors = req.validationErrors(true);
  if (errors) {
    response.error = true;
    response.status = 400;
    response.errors = errors;
    response.userMessage = "Validation errors";
    return SendResponse(res);
  } else {
    User.findOne({
      email: req.body.email.toLowerCase(),
    }).exec(function (err, user) {
      if (err) {
        //send response to client
        response.error = true;
        response.status = 500;
        response.errors = err;
        response.userMessage = "Some server error has occurred.";
        response.data = null;
        return SendResponse(res);
      } else if (user && user.active) {
        //send response to client
        response.error = true;
        response.status = 400;
        response.errors = null;
        response.userMessage = "User email already exists.";
        response.data = null;
        return SendResponse(res);
      } else if (user && !user.active) {
        response.error = true;
        response.status = 401;
        response.errors = null;
        response.userMessage = "User exists but not active";
        response.data = null;
        return SendResponse(res);
      } else {
        var user = new User({
          email: req.body.email.toLowerCase(),
          name: req.body.name,
          password: cryptography.encrypt(req.body.password),
        });

        user.save(function (err) {
          if (err) {
            response.error = true;
            response.status = 500;
            response.errors = err;
            response.userMessage = "Some server error has occurred.";
            response.data = null;
            return SendResponse(res);
          } else {
            response.error = false;
            response.status = 200;
            response.errors = null;
            response.userMessage = "User created successfully";
            response.data = {
              ...user.toObject(),
              password: undefined,
            };
            return SendResponse(res);
          }
        });
      }
    });
  }
};
userController.login = function (req, res) {
    //Check for POST request errors.
    req.checkBody("email", "email code is required.").notEmpty();
    req.checkBody("password", "password code is required.").notEmpty();
    var errors = req.validationErrors(true);
    if (errors) {
      response.error = true;
      response.status = 400;
      response.errors = errors;
      response.userMessage = "Validation errors";
      return SendResponse(res);
    } else {
     
      User.findOne(
        {
          email: req.body.email,
          password: cryptography.encrypt(req.body.password),
        },
        function (err, user) {
          if (err) {
            //send response to client
            response.error = true;
            response.status = 500;
            response.errors = err;
            response.userMessage = "some server error has occurred.";
            response.data = null;
            return SendResponse(res);
          } else if (!user) {
          
            response.error = true;
            response.status = 400;
            response.errors = null;
            response.userMessage = "email and password combination is incorrect.";
            response.data = null;
            return SendResponse(res);
            
          } else {
            console.log("password", cryptography.decrypt(user.password));
            var token = jwt.sign(
              {
                email: req.body.email,
              },
              config.sessionSecret,
              {
                expiresIn: 60 * 120,
              }
            );
  
            Session.findOneAndUpdate(
              {
                userId: user._id,
              },
              {
                authToken: token,
                createdAt: new Date(),
              },
              {
                upsert: true,
                new: true,
              }
            ).exec(function (err) {
              if (err) {
                //send response to client
                response.error = true;
                response.status = 500;
                response.errors = err;
                response.userMessage = "server error";
                response.data = null;
                return SendResponse(res);
              } else {
                //send response to client
                response.error = false;
                response.status = 200;
                response.errors = null;
                response.userMessage = "login success";
                response.data = {
                  user: {
                    ...user.toObject(),
                    password: undefined,
                  },
                  authToken: token,
                  
                };
                return SendResponse(res);
              }
            });
          }
        }
      );
    }
  };



module.exports = userController;
