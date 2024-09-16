import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.type === "payment_intent.succeeded") {
      console.log(JSON.parse(body.data.object.metadata.courseIds));
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
