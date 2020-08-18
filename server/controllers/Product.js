var mongoose = require("mongoose");
var Product = require("../models/Product");

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
var productController = {};

// Show list of employees
productController.list = function(req, res) {
  Product.find({active:true,userId:req.user._id}).exec(function (err, employees) {
    if (err) {
      response.error = true;
      response.status = 400;
      response.errors = err;
      response.userMessage = "Something Went wrong";
      return SendResponse(res);
    }
    else {
      // res.render("../views/employees/index", {employees: employees});
      response.error = false;
            response.status = 200;
            response.errors = null;
            response.userMessage = "Product fetched successfully";
            response.data = employees
            return SendResponse(res);
    }
  });
};

// Show employee by id
productController.detail = function(req, res) {
  Product.findOne({_id: req.params.id,userId:req.user._id}).exec(function (err, employee) {
    if (err||!employee) {
      response.error = true;
      response.status = 400;
      response.errors = err;
      response.userMessage = "No product found";
      return SendResponse(res);
    }
    else {
      response.error = false;
      response.status = 200;
      response.errors = null;
      response.userMessage = "Product detail fetched successfully";
      response.data = employee
      return SendResponse(res);
    }
  });
};

// Create new employee
// employeeController.create = function(req, res) {
//   res.render("../views/employees/create");
// };

// Save new employee
productController.save = function(req, res) {
  req.checkBody("name", "name is required.").notEmpty();
  req.checkBody("price", "email is required.").notEmpty();
  req.checkBody("description", "password is required.").notEmpty();
  var errors = req.validationErrors(true);
  if (errors) {
    response.error = true;
    response.status = 400;
    response.errors = errors;
    response.userMessage = "Validation errors";
    return SendResponse(res);
  } else {
    var product = new Product({...req.body,userId:req.user._id});

    product.save(function(err) {
      if(err) {
        // console.log(err);
        // res.render("../views/employees/create");
        response.error = true;
        response.status = 400;
        response.errors = err;
        response.userMessage = "Something Went wrong";
        return SendResponse(res);
      } else {
        // console.log("Successfully created an employee.");
        // res.redirect("/employees/show/"+employee._id);
        response.error = false;
        response.status = 200;
        response.errors = null;
        response.userMessage = "Product cretaed successfully";
        response.data = product
        return SendResponse(res);
      }
    });
  }
  
};

// Edit an employee
// employeeController.edit = function(req, res) {
//   Product.findOne({_id: req.params.id}).exec(function (err, employee) {
//     if (err) {
//       console.log("Error:", err);
//     }
//     else {
//       res.render("../views/employees/edit", {employee: employee});
//     }
//   });
// };

// Update an employee
productController.update = function(req, res) {
  Product.findOneAndUpdate({_id:req.params.id,userId:req.user._id}, { $set: { name: req.body.name, price: req.body.price }}, { new: true }, function (err, product) {
    if (err) {
      console.log(err);
      // res.render("../views/employees/edit", {employee: req.body});
      response.error = true;
      response.status = 400;
      response.errors = err;
      response.userMessage = "Something Went wrong";
      return SendResponse(res);
    }
    // res.redirect("/employees/show/"+product._id);
    response.error = false;
      response.status = 200;
      response.errors = null;
      response.userMessage = "Product cretaed successfully";
      response.data = product
      return SendResponse(res);
  });
};

// Delete an employee
productController.delete = function(req, res) {
  Product.findOneAndUpdate({_id:req.params.id,userId:req.user._id}, { $set: { active: false }}, { new: true }, function (err, product) {
    if(err) {
      console.log(err);
      response.error = true;
      response.status = 400;
      response.errors = err;
      response.userMessage = "Something Went wrong";
      return SendResponse(res);
    }
    else {
      response.error = false;
      response.status = 200;
      response.errors = null;
      response.userMessage = "Product cretaed successfully";
      response.data = product
      return SendResponse(res);
    }
  });
};

module.exports = productController;
