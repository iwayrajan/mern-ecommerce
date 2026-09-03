const cloudinary = require("cloudinary").v2;
const Product    = require("../models/Product");
const Order      = require("../models/Order");
const User       = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.find({ "paymentInfo.status": "paid" }),
    ]);
    const revenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    res.json({ success: true, stats: { totalProducts, totalOrders, totalUsers, revenue } });
  } catch (err) { next(err); }
};

// GET /api/admin/products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) { next(err); }
};

// POST /api/admin/products
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, mrp, category, brand, stock, featured } = req.body;
    let images = [];

    // Upload images to Cloudinary if provided
    if (req.files?.length) {
      const uploads = await Promise.all(
        req.files.map((f) =>
          cloudinary.uploader.upload(f.path, { folder: "ecommerce/products" })
        )
      );
      images = uploads.map((r) => ({ public_id: r.public_id, url: r.secure_url }));
    }

    const product = await Product.create({ name, description, price, mrp, category, brand, stock, images, featured });
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    // Delete images from Cloudinary
    await Promise.all(product.images.map((img) => cloudinary.uploader.destroy(img.public_id)));
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (err) { next(err); }
};

// GET /api/admin/orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};

// PUT /api/admin/orders/:id — update status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    order.status = status;
    if (status === "delivered") order.deliveredAt = new Date();
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
};
