const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    mrp:         { type: Number, required: true },          // original / crossed-out price
    category:    { type: String, required: true },
    brand:       { type: String, required: true },
    stock:       { type: Number, required: true, default: 0 },
    images: [
      {
        public_id: { type: String },
        url:       { type: String, required: true },
      },
    ],
    reviews:     [reviewSchema],
    rating:      { type: Number, default: 0 },
    numReviews:  { type: Number, default: 0 },
    featured:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Recalculate average rating after reviews change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.numReviews = this.reviews.length;
    this.rating =
      this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
  }
};

module.exports = mongoose.model("Product", productSchema);
