import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentToken } from "../redux/slices/authSlice";
import axios from "axios";

const STATUS_COLORS = {
  processing: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  shipped:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  delivered:  "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function Orders() {
  const token  = useSelector(selectCurrentToken);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/orders/my", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setOrders(r.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading…</div>;

  if (orders.length === 0)
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h1 className="text-2xl font-bold text-white mb-3">No orders yet</h1>
        <Link to="/products" className="btn-primary">Start shopping</Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-bold text-3xl text-white mb-8">My orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 font-mono mb-0.5">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge border ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                <span className="font-bold text-white">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-2">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-800" />
                  <div>
                    <p className="text-sm text-gray-300 max-w-[160px] truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">× {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
