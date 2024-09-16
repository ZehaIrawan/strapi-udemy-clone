import { useEffect, useState } from "react";
import axios from "axios";

export const useCart = () => {
  const [userCart, setUserCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:1337/api/carts?filters[user][id][$eq]=${currentUser.id}&populate=courses`,
        config,
      );

      const cartData = response.data.data;
      setUserCart(cartData[0]);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, []);

  const removeFromCart = async (courseId, cartId) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      await axios.put(
        `http://localhost:1337/api/carts/${cartId}`,
        {
          data: {
            courses: {
              disconnect: [courseId],
            },
          },
        },
        config,
      );
      fetchUserCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return { userCart, loading, removeFromCart, fetchUserCart };
};

export const addToCart = async (cart, course, toast) => {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  if (!cart) {
    try {
      await axios.post(
        `http://localhost:1337/api/carts`,
        {
          data: {
            user: {
              connect: [currentUser.documentId],
            },
            courses: {
              connect: [course.documentId],
            },
          },
        },
        config,
      );
      toast({
        title: "Success",
        description: "Course added to cart",
        duration: 3000,
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  } else {
    try {
      const response = await axios.put(
        `http://localhost:1337/api/carts/${cart.documentId}`,
        {
          data: {
            courses: {
              connect: [course.documentId],
            },
          },
        },
        config,
      );
      toast({
        title: "Success",
        description: "Course added to cart",
        duration: 3000,
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }
};
