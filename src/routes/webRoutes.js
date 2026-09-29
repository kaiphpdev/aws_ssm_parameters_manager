const express = require('express');
const controller = require('../controllers/ssmController');

const router = express.Router();

router.get('/', (req, res) => res.redirect('/ssm'));
router.get('/ssm', controller.index);
router.post('/ssm/save', controller.save);
router.post('/ssm/delete', controller.remove);

module.exports = router;
