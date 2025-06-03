import React, { useState } from "react";
import CustomFooter from "@/components/CustomFooter";
import { useRouter } from "next/router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MANAGER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  const router = useRouter();

  const toggleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup Failed");
      } else {
        router.push("/login");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex flex-col flex-grow justify-center items-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 rounded-box w-full max-w-xs p-6 shadow-md"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Sign-up</h2>

          <label className="label mt-2">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label mt-4">Password</label>
          <div className="relative">
            <input
              type={viewPassword ? "text" : "password"}
              className="input input-bordered w-full pr-12"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleViewPassword}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-primary"
            >
              {viewPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-6"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign-up"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>

        <p className="m-4 text-sm text-center">
          Already a User?{" "}
          <a
            href="/login"
            className="text-primary underline hover:text-primary-focus"
          >
            Click here
          </a>{" "}
          to Login
        </p>
      </div>

      {/* Sticky Footer */}
      <footer className="bg-neutral text-neutral-content w-full p-4 mt-auto z-10 relative">
        <CustomFooter />
      </footer>
    </div>
  );
};

export default Signup;
