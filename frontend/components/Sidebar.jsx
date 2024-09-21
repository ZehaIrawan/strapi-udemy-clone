"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCart, addToCart } from "@/hooks/useCart";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Sidebar = ({ course }) => {
  const { toast } = useToast();
  const { userCart, fetchUserCart } = useCart();
  const [currentUser, setCurrentUser] = useState(null);

  const handleAddToCart = async () => {
    await addToCart(userCart, course, toast);
    await fetchUserCart();
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    setCurrentUser(user);
  }, []);

  return (
    <Card className="w-96 border p-6">
      <img src={course.thumbnail} alt="course thumbnail" />
      <CardHeader>
        <CardTitle>
          <span className="text-2xl font-bold">{`$${course.price}`}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentUser &&
        userCart?.courses?.filter((item) => item.id === course.id).length >
          0 ? (
          <Link href="/cart">
            <Button className="w-full bg-blue-500 text-white">
              Go to cart
            </Button>
          </Link>
        ) : (
          currentUser && (
            <Button
              className="w-full bg-blue-500 text-white"
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default Sidebar;
