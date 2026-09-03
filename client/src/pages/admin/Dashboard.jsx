import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentToken } from "../../redux/slices/authSlice";
import axios from "axios";
import { FiPackage, FiShoppingBag, FiUsers, FiTrendingUp } from "react-icons/fi";

export default function AdminDashboard() {
  const token = useSelector(selectCurrentToken);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setStats(r.data.stats))
      .catch(console.error);
  }, []);

  const cards = stats ? [
    { icon: FiPackage,    label: "Products",     value: stats.totalProducts, color: "text-indigo-400" },
    { icon: FiShoppingBag,label: "Orders",       value: stats.totalOrders,   color: "text-blue-400"   },
    { icon: FiUsers,      label: "Customers",    value: stats.totalUsers,    color: "text-green-400"  },
    { icon: FiTrendingUp, label: "Revenue",      value: `₹${stats.revenue.toLocaleString()}`, color: "text-yellow-400" },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-3xl text-white">Admin dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-primary text-sm">Manage products</Link>
          <Link to="/admin/orders"   className="btn-secondary text-sm">View orders</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-6">
            <Icon size={24} className={`${color} mb-3`} />
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link to="/admin/products" className="card p-6 hover:border-indigo-600/50 transition-colors">
          <h2 className="font-semibold text-white mb-2">Product management</h2>
          <p className="text-sm text-gray-400">Add, edit, or remove products. Upload images via Cloudinary.</p>
        </Link>
        <Link to="/admin/orders" className="card p-6 hover:border-indigo-600/50 transition-colors">
          <h2 className="font-semibold text-white mb-2">Order management</h2>
          <p className="text-sm text-gray-400">Update order status — Processing → Shipped → Delivered.</p>
        </Link>
      </div>
    </div>
  );
}
