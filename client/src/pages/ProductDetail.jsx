import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import axios from "axios";
import { FiStar, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct]   = useState(null);
  const [qty, setQty]           = useState(1);
  const [imgIdx, setImgIdx]     = useState(0);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then((r) => setProduct(r.data.product))
      .catch(console.error);
  }, [id]);

  if (!product) return <div className="text-center py-20 text-gray-500">Loading…</div>;

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAdd = () => {
    dispatch(addToCart({
      product:  product._id,
      name:     product.name,
      price:    product.price,
      image:    product.images[0]?.url || "",
      stock:    product.stock,
      quantity: qty,
    }));
    toast.success("Added to cart");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">

        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800 mb-3">
            <img src={product.images[imgIdx]?.url || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${imgIdx === i ? "border-indigo-500" : "border-gray-700"}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand} · {product.category}</p>
          <h1 className="font-bold text-3xl text-white mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <FiStar key={s} size={16} className={s <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
              ))}
            </div>
            <span className="text-sm text-gray-400">({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-bold text-white">₹{product.price.toLocaleString()}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="text-green-400 font-semibold text-sm">{discount}% off</span>
              </>
            )}
          </div>

          <p className={`text-sm mb-5 ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
            {product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}
          </p>

          <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>

          {/* Qty selector */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2 border border-gray-700 rounded-xl p-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-gray-400 hover:text-white transition-colors"><FiMinus size={16} /></button>
              <span className="w-8 text-center font-semibold text-white">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2 text-gray-400 hover:text-white transition-colors"><FiPlus size={16} /></button>
            </div>
            <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-40">
              <FiShoppingCart size={18} /> Add to cart
            </button>
          </div>

          {/* Reviews */}
          {product.reviews.length > 0 && (
            <div className="mt-10 border-t border-gray-800 pt-8">
              <h2 className="font-semibold text-white text-lg mb-4">Customer reviews</h2>
              <div className="space-y-4">
                {product.reviews.map((r) => (
                  <div key={r._id} className="card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-white text-sm">{r.name}</p>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <FiStar key={s} size={12} className={s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
