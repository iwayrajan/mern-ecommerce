import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { FiSearch } from "react-icons/fi";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home & Kitchen", "Sports"];
const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top rated" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);

  const search   = searchParams.get("search")   || "";
  const category = searchParams.get("category") || "";
  const sort     = searchParams.get("sort")     || "newest";
  const page     = Number(searchParams.get("page") || 1);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.set("page", "1");
    setSearchParams(p);
  };

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (search)   params.search   = search;
    if (category && category !== "All") params.category = category;
    axios.get("/api/products", { params })
      .then((r) => { setProducts(r.data.products); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-bold text-3xl text-white mb-8">All Products</h1>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search products…"
            defaultValue={search}
            onKeyDown={(e) => { if (e.key === "Enter") setParam("search", e.target.value); }}
            className="input pl-9"
          />
        </div>
        <select value={sort} onChange={(e) => setParam("sort", e.target.value)} className="input w-auto">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setParam("category", cat === "All" ? "" : cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              (cat === "All" && !category) || category === cat
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card aspect-square animate-pulse bg-gray-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">🔍</p>
          <p>No products found. Try a different search or category.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-5">{total} product{total !== 1 ? "s" : ""} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
