var express = require('express');
var router = express.Router();
var product = require("../controllers/Product.js");
var session = require("../controllers/Session.js");
router.get('/',session.checkToken, function(req, res) {
  product.list(req, res);
});

router.get('/detail/:id',session.checkToken, function(req, res) {
  product.detail(req, res);
});

router.post('/save',session.checkToken, function(req, res) {
  product.save(req, res);
});

router.post('/update/:id', session.checkToken, function(req, res) {
  product.update(req, res);
});

router.post('/delete/:id',session.checkToken, function(req, res, next) {
  product.delete(req, res);
});

module.exports = router;
