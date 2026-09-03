import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { logout, selectCurrentUser, selectIsAdmin } from "../redux/slices/authSlice";
import { selectCartCount } from "../redux/slices/cartSlice";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const user       = useSelector(selectCurrentUser);
  const isAdmin    = useSelector(selectIsAdmin);
  const cartCount  = useSelector(selectCartCount);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

        <Link to="/" className="font-bold text-xl text-white">
          Shop<span className="text-indigo-400">MERN</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          {isAdmin && <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 transition-colors">Admin</Link>}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/orders" className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                <FiUser size={16} /> Orders
              </Link>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">Sign in</Link>
          )}

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-400">
            <FiMenu size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-800 px-4 py-3 flex flex-col gap-3 text-sm text-gray-400">
          <Link to="/products" onClick={() => setOpen(false)} className="hover:text-white">Products</Link>
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="text-indigo-400">Admin Panel</Link>}
          {user && <Link to="/orders" onClick={() => setOpen(false)} className="hover:text-white">My Orders</Link>}
        </div>
      )}
    </nav>
  );
}
