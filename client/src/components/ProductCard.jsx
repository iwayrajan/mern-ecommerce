import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { FiStar, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      product:  product._id,
      name:     product.name,
      price:    product.price,
      image:    product.images[0]?.url || "",
      stock:    product.stock,
      quantity: 1,
    }));
    toast.success("Added to cart");
  };

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <Link to={`/products/${product._id}`} className="card group flex flex-col overflow-hidden hover:border-indigo-600/50 transition-colors duration-200">
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <img
          src={product.images[0]?.url || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Out of stock</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <p className="font-semibold text-gray-100 line-clamp-2 flex-1">{product.name}</p>

        <div className="flex items-center gap-1 mt-2">
          <FiStar size={13} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-400">{product.rating.toFixed(1)} ({product.numReviews})</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="font-bold text-white text-lg">₹{product.price.toLocaleString()}</span>
          {product.mrp > product.price && (
            <span className="text-sm text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-3 flex items-center justify-center gap-2 w-full btn-primary py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FiShoppingCart size={15} /> Add to cart
        </button>
      </div>
    </Link>
  );
}
