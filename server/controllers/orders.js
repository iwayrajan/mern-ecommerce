const Razorpay = require("razorpay");
const crypto  = require("crypto");
const Order   = require("../models/Order");
const Product = require("../models/Product");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders — create order + Razorpay order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    // Validate stock and calculate totals
    let itemsTotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock: ${product.name}` });
      itemsTotal += product.price * item.quantity;
    }

    const shippingPrice = itemsTotal >= 500 ? 0 : 49; // Free shipping over ₹500
    const totalAmount   = itemsTotal + shippingPrice;

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(totalAmount * 100),
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    });

    // Save order in DB (pending payment)
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentInfo: { razorpayOrderId: razorpayOrder.id, status: "pending" },
      itemsTotal,
      shippingPrice,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      order,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId:   process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) { next(err); }
};

// POST /api/orders/verify-payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Verify signature
    const body = `${order.paymentInfo.razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpaySignature)
      return res.status(400).json({ success: false, message: "Payment verification failed" });

    // Mark as paid and reduce stock
    order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
    order.paymentInfo.razorpaySignature  = razorpaySignature;
    order.paymentInfo.status = "paid";
    order.paymentInfo.paidAt = new Date();
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.json({ success: true, message: "Payment verified", order });
  } catch (err) { next(err); }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name images price");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Access denied" });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};
