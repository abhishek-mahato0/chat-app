import React from "react";
import { Navbar } from "../NavBar";

const NavWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default NavWrapper;
