import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import API from "../../api.js";

const Login = () => {
   const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ CHECK TOKEN + EXPIRY
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (token && expiry) {
      const currentTime = new Date().getTime();

      // ✅ token valid
      if (currentTime < Number(expiry)) {
        navigate("/dashboard");
      } else {
        // ✅ token expired after 5 min
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email || !form.password) {
      return "All fields are required";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Invalid email format";
    }

    return "";
  };

  // ✅ LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post(
        "/auth/login",
        form
      );

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ 5 MIN EXPIRY
      const expiryTime =
        new Date().getTime() + 1 * 60 * 1000;

      localStorage.setItem(
        "tokenExpiry",
        expiryTime
      );

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-8">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="bg-red-500/50 text-white p-2 rounded mb-3 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-white/30 placeholder-white text-white border border-white/40 p-2 rounded-lg outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/30 placeholder-white text-white border border-white/40 p-2 rounded-lg pr-10 outline-none"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* ✅ Forgot Password */}
          <div className="flex justify-end">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-indigo-400 cursor-pointer hover:underline"
            >
              Forgot Password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-600 font-semibold p-2 rounded-lg cursor-pointer hover:opacity-90"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* ✅ Create Account Link */}
          <p className="text-center text-white text-sm mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-indigo-400 underline cursor-pointer hover:text-indigo-300"
            >
              Create Account
            </span>
          </p>

        </form>

      </div>
    </div>
  );
};

export default Login;