import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.type === "payment_intent.succeeded") {
      const metadata = body.data.object.metadata;
      const courseIds = JSON.parse(metadata.courseIds);
      const token = metadata.token;
      const cartId = metadata.cartId;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      try {
        const res = await axios.put(
          `http://127.0.0.1:1337/api/carts/${cartId}`,
          {
            data: {
              courses: {
                disconnect: [...courseIds],
              },
            },
          },
          config,
        );
        console.log(res.status, res.statusText, "res");
      } catch (error) {
        console.error("Error removing from cart:", error);
      }

      try {
        const updateCoursePromises = courseIds.map((courseId) =>
          axios.put(
            `http://127.0.0.1:1337/api/courses/${courseId}`,
            {
              data: {
                isPurchased: true,
              },
            },
            config,
          ),
        );

        const responses = await Promise.all(updateCoursePromises);
      } catch (error) {
        console.error("Error updating courses:", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
}
