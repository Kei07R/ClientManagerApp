import React from "react";
import CustomFooter from "@/components/CustomFooter";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex flex-col flex-grow justify-center items-center px-4">
        <form className="bg-base-200 rounded-box w-full max-w-xs p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

          <label className="label mt-2">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
          />

          <label className="label mt-4">Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Password"
          />

          <button className="btn btn-primary w-full mt-6">Login</button>
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
