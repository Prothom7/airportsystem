// app/api/admin/aircraft/route.ts
import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Aircraft from "@/models/aircraftModel";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const body = await request.json();

    const aircraft = await Aircraft.create(body);

    return NextResponse.json({ message: "Aircraft created successfully", aircraft }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
