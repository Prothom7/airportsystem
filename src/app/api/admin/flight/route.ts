import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Flight from "@/models/flightModel";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const userId = getDataFromToken(request);
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const flight = await Flight.create(body);
    return NextResponse.json({ message: "Flight created", flight });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
