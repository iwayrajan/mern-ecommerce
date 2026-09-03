import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home & Kitchen", "Sports"];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get("/api/products?limit=4&sort=rating")
      .then((r) => setFeatured(r.data.products))
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-950/30 to-gray-950 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 mb-4 block">
            MERN Stack E-Commerce
          </span>
          <h1 className="font-bold text-5xl sm:text-6xl text-white leading-tight mb-6">
            Shop smarter.<br />
            <span className="text-indigo-400">Pay faster.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            A full-featured online store with Razorpay payments, real-time inventory, and a complete admin panel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="btn-primary px-8 py-3 text-base">
              Browse products
            </Link>
            <Link to="/register" className="btn-secondary px-8 py-3 text-base">
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-bold text-2xl text-white mb-6">Shop by category</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors text-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl text-white">Top rated products</h2>
          <Link to="/products" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            View all →
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No products yet. Seed the database to get started.</p>
        )}
      </section>

      {/* Feature highlights */}
      <section className="bg-gray-900 border-t border-b border-gray-800 py-16 px-4">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: "🚀", title: "Fast delivery",       desc: "Orders processed and shipped within 24 hours" },
            { icon: "🔒", title: "Secure payments",     desc: "Razorpay-powered checkout — UPI, cards, net banking" },
            { icon: "📦", title: "Easy returns",        desc: "30-day hassle-free return policy" },
          ].map((f) => (
            <div key={f.title}>
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
