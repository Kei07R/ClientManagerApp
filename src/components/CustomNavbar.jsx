import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const CustomNavbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  return (
    <nav className="navbar bg-neutral text-neutral-content p-4 flex justify-between items-center">
      {/* Left Side - App Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={goToProfile}
      >
        <Image
          unoptimized
          className="rounded-xl"
          src="/client_manager.gif"
          alt="Client Manager Logo"
          width={40}
          height={40}
        />
        <span className="text-lg font-bold">Client Manager</span>
      </div>

      {/* Right Side - Logout */}
      <button
        onClick={handleLogout}
        className="btn btn-sm btn-error text-white"
      >
        Logout
      </button>
    </nav>
  );
};

export default CustomNavbar;
