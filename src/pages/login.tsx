import React, { useState } from "react";
import CustomFooter from "@/components/CustomFooter";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const res = await fetch("api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login Failed");
      } else {
        localStorage.setItem("token", data.token);
        router.push("/profile");
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
          className="bg-base-200 rounded-box w-full max-w-xs p-6 shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

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
              className="input input-bordered w-full"
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
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>

        <p className="m-4 text-sm text-center">
          New User?{" "}
          <a
            href="/signup"
            className="text-primary underline hover:text-primary-focus"
          >
            Click here
          </a>{" "}
          to Sign-up
        </p>
      </div>

      {/* Sticky Footer */}
      <footer className="bg-neutral text-neutral-content w-full p-4 mt-auto z-10 relative">
        <CustomFooter />
      </footer>
    </div>
  );
};

export default Login;
