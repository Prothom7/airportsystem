import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Airport from "@/models/airportModel";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
  await connect();

  try {
    let userId;
    try {
      userId = getDataFromToken(request);
      console.log("User ID from token:", userId);
    } catch (tokenError) {
      console.error("Token error:", tokenError);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!user.isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
      console.log("Request body:", body);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const airport = await Airport.create(body);
    console.log("Created airport:", airport);

    return NextResponse.json({ message: "Airport created successfully", airport }, { status: 201 });

  } catch (error: any) {
    console.error("Internal server error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
