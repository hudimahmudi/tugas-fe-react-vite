const router = require('express').Router();
const auth = require('../middleware/auth');
const { addMetric } = require('../controllers/metric.controller');

router.post('/contents/:id/metrics', auth, addMetric);

module.exports = router;