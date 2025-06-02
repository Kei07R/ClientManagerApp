import React from "react";
import Image from "next/image";

const CustomFooter = () => {
  return (
    <div>
      <footer className="footer bg-neutral text-neutral-content items-center p-4">
        <aside className="flex items-center gap-4">
          <Image
            className="rounded-xl"
            src="/client_manager.gif"
            alt="Client Manager Logo"
            width={48}
            height={48}
          />
          <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
        </aside>
      </footer>
    </div>
  );
};

export default CustomFooter;
