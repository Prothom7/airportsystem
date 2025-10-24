import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConnection/dbConnection";
import Flight from "@/models/flightModel";        // <-- FIRST
import Booking from "@/models/reservationModel"; // <-- AFTER
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "flight",
        populate: [
          { path: "departureAirport", select: "name" },
          { path: "arrivalAirport", select: "name" }
        ]
      })
      .sort({ bookingDate: -1 });

    const now = new Date();
    const current = bookings
      .filter(b => b.flight && b.flight.departureTime > now)
      .map(b => b.flight);
    const previous = bookings
      .filter(b => b.flight && b.flight.departureTime <= now)
      .map(b => b.flight);

    return NextResponse.json({ current, previous }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching flights:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
