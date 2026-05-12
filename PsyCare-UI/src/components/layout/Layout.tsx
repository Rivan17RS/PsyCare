import { ReactNode } from "react";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <main className="p-6 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}