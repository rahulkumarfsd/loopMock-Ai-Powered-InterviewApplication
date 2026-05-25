const User = require('../models/User.model');
const { asyncHandler, ApiError, sendSuccess } = require('../utils/apiError');
const {
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  cancelSubscription,
  PLAN_LIMITS,
  PLANS,
} = require('../services/Razorpay.service');
const { sendUpgradeConfirm, sendPaymentFailed } = require('../services/email.service');

const createPaymentOrder = asyncHandler(async (req, res, next) => {
  const { plan } = req.body;
  if (!['pro', 'enterprise'].includes(plan))
    return next(new ApiError(400, 'Invalid plan'));

  const order = await createOrder({ userId: req.user._id.toString(), plan });

  sendSuccess(res, 200, 'Order created', {
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
    plan,
    keyId:    process.env.RAZORPAY_KEY_ID,
  });
});

// POST /api/billing/verify-payment
const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return next(new ApiError(400, 'Missing payment details'));

  const isValid = verifyPaymentSignature({
    orderId:   razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid)
    return next(new ApiError(400, 'Invalid payment signature'));

  const user = await User.findByIdAndUpdate(req.user._id, {
    plan,
    razorpayPaymentId:  razorpay_payment_id,
    razorpayOrderId:    razorpay_order_id,
    subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }, { new: true });

  await sendUpgradeConfirm(user, plan);
  console.log(` ${user.email} upgraded to ${plan}`);
  sendSuccess(res, 200, `Upgraded to ${plan}!`, { plan, user });
});

// POST /api/billing/webhook
const webhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  if (!verifyWebhookSignature(req.body, signature)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = req.body.event;
  try {
    switch (event) {
      case 'subscription.activated': {
        const sub    = req.body.payload.subscription.entity;
        const userId = sub.notes?.userId;
        const plan   = sub.notes?.plan;
        if (userId && plan) {
          const user = await User.findByIdAndUpdate(userId,
            { plan, razorpaySubscriptionId: sub.id, subscriptionEndsAt: null },
            { new: true }
          );
          if (user) await sendUpgradeConfirm(user, plan);
        }
        break;
      }
      case 'subscription.halted':
      case 'payment.failed': {
        const sub    = req.body.payload.subscription?.entity;
        const userId = sub?.notes?.userId;
        if (userId) {
          const user = await User.findByIdAndUpdate(userId,
            { plan: 'free', subscriptionEndsAt: new Date() },
            { new: true }
          );
          if (user) await sendPaymentFailed(user);
        }
        break;
      }
      case 'subscription.cancelled': {
        const sub    = req.body.payload.subscription.entity;
        const userId = sub.notes?.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, {
            subscriptionEndsAt: new Date(sub.current_end * 1000),
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
  }
  res.json({ received: true });
};

// GET /api/billing/status
const getBillingStatus = asyncHandler(async (req, res) => {
  const user   = await User.findById(req.user._id);
  const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

  const serialize = (l) => {
    const out = {};
    for (const [k, v] of Object.entries(l)) out[k] = v === Infinity ? null : v;
    return out;
  };

  sendSuccess(res, 200, 'Billing status', {
    plan:             user.plan,
    limits:           serialize(limits),
    subscriptionEnds: user.subscriptionEndsAt,
    plans: Object.entries(PLANS).map(([key, p]) => ({
      key,
      name:      p.name,
      amountINR: `₹${(p.amount / 100).toLocaleString('en-IN')}`,
      amount:    p.amount,
      currency:  p.currency,
    })),
    usage: {
      interviewsThisMonth: user.usage?.interviewsThisMonth || 0,
      resumesThisMonth:    user.usage?.resumesThisMonth    || 0,
    },
  });
});

// POST /api/billing/cancel
const cancelPlan = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.plan === 'free') return next(new ApiError(400, 'No active subscription'));
  if (user.razorpaySubscriptionId) await cancelSubscription(user.razorpaySubscriptionId);
  sendSuccess(res, 200, 'Cancelled. Access continues until period end.', {
    subscriptionEndsAt: user.subscriptionEndsAt,
  });
});

module.exports = { createPaymentOrder, verifyPayment, webhook, getBillingStatus, cancelPlan };