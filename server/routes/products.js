const router  = require("express").Router();
const { getProducts, getProduct, addReview } = require("../controllers/products");
const { protect } = require("../middleware/auth");

router.get("/",           getProducts);
router.get("/:id",        getProduct);
router.post("/:id/reviews", protect, addReview);

module.exports = router;
