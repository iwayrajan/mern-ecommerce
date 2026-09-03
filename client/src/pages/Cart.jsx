import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from "react-icons/fi";

export default function Cart() {
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const shipping = total >= 500 ? 0 : 49;

  if (items.length === 0)
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some products to get started.</p>
        <Link to="/products" className="btn-primary">Browse products</Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-bold text-3xl text-white mb-8">Shopping cart</h1>
      <div className="grid md:grid-cols-[1fr_340px] gap-8">

        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product} className="card p-4 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-800 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{item.name}</p>
                <p className="text-indigo-400 font-bold mt-1">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 border border-gray-700 rounded-lg p-1">
                <button onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ productId: item.product, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.product))} className="p-1.5 text-gray-400 hover:text-white"><FiMinus size={14} /></button>
                <span className="w-6 text-center text-sm font-semibold text-white">{item.quantity}</span>
                <button onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: Math.min(item.stock, item.quantity + 1) }))} className="p-1.5 text-gray-400 hover:text-white"><FiPlus size={14} /></button>
              </div>
              <button onClick={() => dispatch(removeFromCart(item.product))} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-semibold text-white text-lg mb-5">Order summary</h2>
          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && <p className="text-xs text-gray-500">Add ₹{(500 - total).toFixed(0)} more for free shipping</p>}
            <div className="flex justify-between text-white font-bold text-base border-t border-gray-700 pt-3">
              <span>Total</span><span>₹{(total + shipping).toLocaleString()}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
            Proceed to checkout <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
