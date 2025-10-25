import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConnection/dbConnection";
import Taxi from "@/models/taxiModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connect();

    const userId = getDataFromToken(request);
    console.log("User ID from token:", userId);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all taxis for debug
    const taxis = await Taxi.find();
    console.log("All taxis in DB:", taxis);

    // Attempt to filter by user
    const userTaxis = await Taxi.find({ user: userId });
    console.log("Taxis for user:", userTaxis);

    return NextResponse.json({ all: taxis, user: userTaxis }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching taxis:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
