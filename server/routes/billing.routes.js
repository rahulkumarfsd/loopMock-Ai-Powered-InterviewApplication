const router = require('express').Router();
const {
  createPaymentOrder, verifyPayment, webhook, getBillingStatus, cancelPlan,
} = require('../controllers/billing.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/webhook', webhook); // Razorpay calls this — no auth needed
router.use(protect);
router.post('/create-order',   createPaymentOrder);
router.post('/verify-payment', verifyPayment);
router.get('/status',          getBillingStatus);
router.post('/cancel',         cancelPlan);

module.exports = router;