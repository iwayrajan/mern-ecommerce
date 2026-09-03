import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", form);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success("Account created! Welcome 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="font-bold text-2xl text-white mb-1">Create account</h1>
        <p className="text-gray-400 text-sm mb-7">Join ShopMERN today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name",     type: "text",     label: "Full name",     placeholder: "Rajan Kumar" },
            { name: "email",    type: "email",    label: "Email",         placeholder: "you@example.com" },
            { name: "password", type: "password", label: "Password",      placeholder: "Min 6 characters" },
          ].map(({ name, type, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
              <input type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required minLength={name === "password" ? 6 : undefined} className="input" placeholder={placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-40">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
