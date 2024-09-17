"use client";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Delete } from "lucide-react";
import Loader from "@/components/Loader";
import { useCart } from "@/hooks/useCart";
import CheckoutCart from '@/components/CheckoutCart';

const CartPage = () => {
  const { userCart, loading, removeFromCart } = useCart();

  const handleRemoveFromCart = (courseId, cartId) => {
    removeFromCart(courseId, cartId);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 pt-4 px-24">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-12">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>
            {userCart?.courses?.length === 0 || !userCart?.courses ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {userCart.courses.map((item) => {
                  return (
                    <Card
                      key={item.id}
                      className="bg-white shadow-md rounded-md max-w-2xl"
                    >
  
                      <CardContent className="flex gap-4 pt-6">
                        <img className='w-24' src={item.thumbnail} alt="course thumbnail" />
                        <div>
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="font-bold text-xl">${item.price}</p>
                        </div>
                        {/* Add any additional item details here */}
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button
                          variant="outline"
                          color="red"
                          onClick={() =>
                            handleRemoveFromCart(
                              item.documentId,
                              userCart.documentId,
                            )
                          }
                          className="flex items-center space-x-2"
                        >
                          <Delete className="w-5 h-5" />
                          <span>Remove</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
          {userCart?.courses?.length > 0 && (
            <CheckoutCart />
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
