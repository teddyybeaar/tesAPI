const express = require('express');
const router = express.Router();
const db  = require('../config/dbConnection');
const { signupValidation, loginValidation } = require('../config/validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { api } = require('../controller')

router.post('/add', api.add, signupValidation, (req, res, next) => {
  
});
router.post('/login', api.login, loginValidation, (req, res, next) => {
  
});
router.get('/get', api.getDataApi);


module.exports = router;