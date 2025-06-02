import React from "react";
import CustomFooter from "@/components/CustomFooter";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section (Centered) */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold">CLIENT MANAGER</h1>
          <p className="py-6">
            Client Manager offers a straightforward solution for managing your
            clients. Welcome to a more organized approach.
          </p>
          <div className="flex flex-col">
            <button
              onClick={() => router.push("/login")}
              className="btn btn-primary m-3 mt-7"
            >
              LOGIN
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="btn btn-primary m-3"
            >
              SIGNUP
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral text-neutral-content w-full p-4 mt-auto z-10 relative">
        <CustomFooter />
      </footer>
    </div>
  );
};

export default HomePage;
