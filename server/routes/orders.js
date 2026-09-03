const router = require("express").Router();
const { createOrder, verifyPayment, getMyOrders, getOrder } = require("../controllers/orders");
const { protect } = require("../middleware/auth");

router.post("/",               protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/my",              protect, getMyOrders);
router.get("/:id",             protect, getOrder);

module.exports = router;
