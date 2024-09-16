"use client";
import { useState, useEffect } from "react";
import NavAvatar from "@/components/NavAvatar";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import SearchBar from "@/components/SearchBar";

const Navbar = () => {
  const [userData, setUserData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserData(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) setUserData(JSON.parse(storedUserData));
  }, []);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSearchResults(null);
      return;
    }

    fetch(`http://localhost:1337/api/courses?filters[title][$contains]=${debouncedSearchTerm}`)
      .then(response => response.json())
      .then(data => setSearchResults(data.data || []))
      .catch(error => {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      });
  }, [debouncedSearchTerm]);

  return (
    <div className="flex items-center justify-between gap-12">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
      </div>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchResults={searchResults}
      />
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