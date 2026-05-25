// /**
//  * Razorpay Payment Service — Perfect for India
//  * Free signup: razorpay.com
//  * Supports: UPI, Cards, Netbanking, Wallets, EMI
//  *
//  * Setup:
//  * 1. npm install razorpay
//  * 2. Sign up at razorpay.com (free, no international card needed)
//  * 3. Dashboard → Settings → API Keys → Generate Key
//  * 4. Add to .env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
//  */
// const Razorpay = require('razorpay');
// const crypto   = require('crypto');

// const razorpay = new Razorpay({
//   key_id:     process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // ── Plan prices in Indian Rupees (paise) ──────────────
// // 1 INR = 100 paise
// const PLANS = {
//   pro: {
//     name:     'Pro Monthly',
//     amount:   74900,   // ₹749/month (~$9)
//     currency: 'INR',
//     period:   'monthly',
//     interval:  1,
//   },
//   enterprise: {
//     name:     'Enterprise Monthly',
//     amount:   249900,  // ₹2499/month (~$29)
//     currency: 'INR',
//     period:   'monthly',
//     interval:  1,
//   },
// };

// const PLAN_LIMITS = {
//   free: {
//     interviewsPerMonth: 3,
//     codingProblems:     5,
//     resumeAnalysis:     1,
//     voiceMode:          false,
//     peerMock:           false,
//     analyticsHistory:   7,
//     companyPrep:        3,
//   },
//   pro: {
//     interviewsPerMonth: Infinity,
//     codingProblems:     Infinity,
//     resumeAnalysis:     Infinity,
//     voiceMode:          true,
//     peerMock:           true,
//     analyticsHistory:   Infinity,
//     companyPrep:        Infinity,
//   },
//   enterprise: {
//     interviewsPerMonth: Infinity,
//     codingProblems:     Infinity,
//     resumeAnalysis:     Infinity,
//     voiceMode:          true,
//     peerMock:           true,
//     analyticsHistory:   Infinity,
//     companyPrep:        Infinity,
//     teamDashboard:      true,
//     customBranding:     true,
//     prioritySupport:    true,
//   },
// };

// /**
//  * Create Razorpay subscription
//  * Returns subscription object with short_url for payment
//  */
// const createSubscription = async ({ userId, plan }) => {
//   const planConfig = PLANS[plan];
//   if (!planConfig) throw new Error(`Unknown plan: ${plan}`);

//   // First create a plan in Razorpay (or use existing plan_id from dashboard)
//   const planId = process.env[`RAZORPAY_${plan.toUpperCase()}_PLAN_ID`];

//   if (!planId) {
//     throw new Error(
//       `RAZORPAY_${plan.toUpperCase()}_PLAN_ID not set in .env. ` +
//       'Create a plan in Razorpay Dashboard → Subscriptions → Plans'
//     );
//   }

//   const subscription = await razorpay.subscriptions.create({
//     plan_id:         planId,
//     total_count:     12,          // 12 months
//     quantity:        1,
//     notes: {
//       userId:        userId.toString(),
//       plan,
//     },
//   });

//   return subscription;
// };

// /**
//  * Create a one-time order (alternative to subscription)
//  * Easier for testing — user pays monthly manually
//  */
// const createOrder = async ({ userId, plan }) => {
//   const planConfig = PLANS[plan];
//   if (!planConfig) throw new Error(`Unknown plan: ${plan}`);

//   const order = await razorpay.orders.create({
//     amount:   planConfig.amount,
//     currency: planConfig.currency,
//     receipt:  `order_${userId}_${Date.now()}`,
//     notes: {
//       userId: userId.toString(),
//       plan,
//     },
//   });

//   return order;
// };

// /**
//  * Verify payment signature (webhook security)
//  * Call this in webhook handler to verify Razorpay sent the request
//  */
// const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
//   const body      = `${orderId}|${paymentId}`;
//   const expected  = crypto
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//     .update(body)
//     .digest('hex');
//   return expected === signature;
// };

// /**
//  * Verify webhook signature
//  */
// const verifyWebhookSignature = (body, signature) => {
//   const expected = crypto
//     .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
//     .update(JSON.stringify(body))
//     .digest('hex');
//   return expected === signature;
// };

// /**
//  * Fetch subscription details
//  */
// const getSubscription = async (subscriptionId) => {
//   return razorpay.subscriptions.fetch(subscriptionId);
// };

// /**
//  * Cancel subscription
//  */
// const cancelSubscription = async (subscriptionId) => {
//   return razorpay.subscriptions.cancel(subscriptionId);
// };

// module.exports = {
//   razorpay,
//   PLANS,
//   PLAN_LIMITS,
//   createSubscription,
//   createOrder,
//   verifyPaymentSignature,
//   verifyWebhookSignature,
//   getSubscription,
//   cancelSubscription,
// };