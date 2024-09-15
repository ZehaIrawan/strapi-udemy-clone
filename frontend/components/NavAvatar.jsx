"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NavAvatar = ({ userData }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const initials = userData.email.slice(0, 2).toUpperCase();

  return (
    <div
      className="relative flex items-center space-x-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src="" alt={`${initials} Avatar`} />
        <AvatarFallback className="bg-blue-500 text-white">
          {initials}
        </AvatarFallback>
      </Avatar>

      {isHovered && (
        <div
          className="absolute top-12 right-0 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-64 z-10"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex flex-col items-center">
            <Button onClick={handleLogout}>Logout</Button>

            <span className="text-gray-500 block">{userData.username}</span>
            <span className="text-gray-500 block"> {userData.email}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavAvatar;