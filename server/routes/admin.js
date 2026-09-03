const router  = require("express").Router();
const multer  = require("multer");
const upload  = multer({ dest: "uploads/" });
const { protect, adminOnly } = require("../middleware/auth");
const {
  getStats, getProducts, createProduct, updateProduct, deleteProduct,
  getOrders, updateOrderStatus,
} = require("../controllers/admin");

router.use(protect, adminOnly);

router.get("/stats",          getStats);
router.get("/products",       getProducts);
router.post("/products",      upload.array("images", 5), createProduct);
router.put("/products/:id",   updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders",         getOrders);
router.put("/orders/:id",     updateOrderStatus);

module.exports = router;
