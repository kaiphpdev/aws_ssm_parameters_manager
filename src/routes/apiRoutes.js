const express = require('express');
const controller = require('../controllers/ssmController');

const router = express.Router();

router.get('/ssm', controller.apiList);

module.exports = router;
