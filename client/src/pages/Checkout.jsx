import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCartItems, selectCartTotal, clearCart } from "../redux/slices/cartSlice";
import { selectCurrentToken } from "../redux/slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

export default function Checkout() {
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const token    = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shipping  = total >= 500 ? 0 : 49;

  const [form, setForm] = useState({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create order + get Razorpay order id
      const { data } = await axios.post(
        "/api/orders",
        { items: items.map(({ product, name, image, price, quantity }) => ({ product, name, image, price, quantity })), shippingAddress: form },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Open Razorpay checkout
      const options = {
        key:         data.razorpayKeyId,
        amount:      (data.order.totalAmount * 100).toString(),
        currency:    "INR",
        name:        "ShopMERN",
        description: "Order Payment",
        order_id:    data.razorpayOrderId,
        handler: async (response) => {
          try {
            await axios.post(
              "/api/orders/verify-payment",
              { orderId: data.order._id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(clearCart());
            toast.success("Payment successful! 🎉");
            navigate("/order-success");
          } catch {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-bold text-3xl text-white mb-8">Checkout</h1>
        <form onSubmit={handleCheckout} className="grid md:grid-cols-[1fr_340px] gap-8">

          {/* Shipping form */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-5">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: "name",    label: "Full name",   full: true },
                { name: "phone",   label: "Phone number", full: true },
                { name: "street",  label: "Street address", full: true },
                { name: "city",    label: "City" },
                { name: "state",   label: "State" },
                { name: "pincode", label: "PIN code" },
              ].map(({ name, label, full }) => (
                <div key={name} className={full ? "sm:col-span-2" : ""}>
                  <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                  <input name={name} value={form[name]} onChange={handleChange} required className="input" />
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="card p-6 h-fit">
            <h2 className="font-semibold text-white mb-4">Order summary</h2>
            <div className="space-y-3 mb-5 max-h-52 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product} className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">× {item.quantity}</p>
                  </div>
                  <p className="text-sm text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 space-y-2 text-sm mb-5">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              <div className="flex justify-between text-white font-bold text-base pt-1">
                <span>Total</span><span>₹{(total + shipping).toLocaleString()}</span>
              </div>
            </div>
            <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full disabled:opacity-40">
              {loading ? "Processing…" : "Pay with Razorpay"}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">Secured by Razorpay</p>
          </div>
        </form>
      </div>
    </>
  );
}
