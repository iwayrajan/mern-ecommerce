import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus } from "react-icons/fi";

export default function AdminProducts() {
  const token = useSelector(selectCurrentToken);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", mrp: "", category: "", brand: "", stock: "", featured: false });

  const load = () =>
    axios.get("/api/admin/products", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setProducts(r.data.products));

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      await axios.post("/api/admin/products", fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      toast.success("Product created");
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Deleted");
      load();
    } catch { toast.error("Error deleting"); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-3xl text-white">Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Add product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 mb-8 grid sm:grid-cols-2 gap-4">
          <h2 className="font-semibold text-white sm:col-span-2">New product</h2>
          {[
            { name: "name",        label: "Name",        full: true },
            { name: "description", label: "Description", full: true },
            { name: "brand",       label: "Brand" },
            { name: "category",    label: "Category" },
            { name: "price",       label: "Price (₹)",   type: "number" },
            { name: "mrp",         label: "MRP (₹)",     type: "number" },
            { name: "stock",       label: "Stock",       type: "number" },
          ].map(({ name, label, full, type = "text" }) => (
            <div key={name} className={full ? "sm:col-span-2" : ""}>
              <label className="block text-sm text-gray-400 mb-1">{label}</label>
              <input type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required className="input" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Images (up to 5)</label>
            <input type="file" name="images" multiple accept="image/*" className="input" onChange={(e) => setForm({ ...form, images: e.target.files })} />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary">Create product</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr>
              {["Product", "Category", "Price", "Stock", "Rating", ""].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-4 font-medium text-white">{p.name}</td>
                <td className="py-3 px-4 text-gray-400">{p.category}</td>
                <td className="py-3 px-4 text-white">₹{p.price.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={p.stock > 0 ? "text-green-400" : "text-red-400"}>{p.stock}</span>
                </td>
                <td className="py-3 px-4 text-gray-400">⭐ {p.rating.toFixed(1)}</td>
                <td className="py-3 px-4">
                  <button onClick={() => handleDelete(p._id)} className="text-gray-500 hover:text-red-400 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
