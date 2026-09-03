import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

const STATUSES = ["processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  processing: "text-yellow-400",
  shipped:    "text-blue-400",
  delivered:  "text-green-400",
  cancelled:  "text-red-400",
};

export default function AdminOrders() {
  const token = useSelector(selectCurrentToken);
  const [orders, setOrders] = useState([]);

  const load = () =>
    axios.get("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setOrders(r.data.orders));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/orders/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Status updated");
      load();
    } catch { toast.error("Error updating status"); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-bold text-3xl text-white mb-8">Orders ({orders.length})</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr>
              {["Order ID", "Customer", "Amount", "Payment", "Status", "Update status"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="py-3 px-4">
                  <p className="text-white">{order.user?.name || "—"}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="py-3 px-4 font-semibold text-white">₹{order.totalAmount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={order.paymentInfo.status === "paid" ? "text-green-400" : "text-yellow-400"}>
                    {order.paymentInfo.status}
                  </span>
                </td>
                <td className={`py-3 px-4 font-medium ${STATUS_COLORS[order.status]}`}>{order.status}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
