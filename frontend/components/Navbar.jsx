"use client";
import { useState, useEffect } from "react";
import NavAvatar from "@/components/NavAvatar";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserData(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="flex items-center justify-between gap-12">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
      </div>
      <Link
        href="/cart"
        className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        aria-label="View Cart"
      >
        <div className="relative flex items-center">
          <ShoppingCart size={24} className="text-gray-700" />
        </div>
      </Link>
      {userData && <Link href="/my-learning">My learning</Link>}
      {userData && <Link href="/manage-courses">Manage Courses</Link>}
      {userData ? (
        <NavAvatar userData={userData} />
      ) : (
        <div className="flex gap-4">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;