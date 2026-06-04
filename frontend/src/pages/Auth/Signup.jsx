import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "All fields are required";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Invalid email format";
    }

    if (form.password.length < 5) {
      return "Password must be at least 5 characters";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    return "";
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
        "http://localhost:8000/auth/signup",
        form
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Signup successful! Redirecting to login...");

      // ✅ Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee",
      });

      // ✅ Redirect after 1.5 sec
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-8">
        
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account ✨
        </h2>

        {/* Error */}
        {error && (
          <p className="bg-red-500/50 text-white p-2 rounded mb-3 text-sm text-center">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="bg-green-500/20 text-white p-2 rounded mb-3 text-sm text-center">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              placeholder="First Name"
              onChange={handleChange}
              className="bg-white/30 placeholder-white text-white border border-white/40 p-2 rounded-lg focus:outline-none"
            />

            <input
              type="text"
              name="lastName"
              value={form.lastName}
              placeholder="Last Name"
              onChange={handleChange}
              className="bg-white/30 placeholder-white text-white border border-white/40 p-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full bg-white/30 placeholder-white text-white border border-white/40 p-2 rounded-lg focus:outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            className="w-full bg-white/30 placeholder-white text-white border border-white/40 p-2 rounded-lg focus:outline-none"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full bg-white/30 placeholder-white text-white border border-white/40 p-2 rounded-lg focus:outline-none"
          />

          {/* Role */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-white/30 text-white border border-white/40 p-2 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value="employee" className="text-black">Employee</option>
            <option value="admin" className="text-black">Admin</option>
          </select>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-600 font-semibold p-2 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;