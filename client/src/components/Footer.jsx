import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} ShopMERN. Final year project kit.</p>
        <div className="flex items-center gap-6">
          <Link to="/products" className="hover:text-gray-300 transition-colors">Products</Link>
          <Link to="/orders"   className="hover:text-gray-300 transition-colors">Orders</Link>
        </div>
      </div>
    </footer>
  );
}
