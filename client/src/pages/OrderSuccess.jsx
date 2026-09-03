import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="font-bold text-3xl text-white mb-3">Order placed!</h1>
      <p className="text-gray-400 mb-10">
        Your payment was successful. You'll receive a confirmation shortly.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/orders"   className="btn-primary">View my orders</Link>
        <Link to="/products" className="btn-secondary">Continue shopping</Link>
      </div>
    </div>
  );
}
