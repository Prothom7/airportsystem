import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/reservationModel";
import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const userId = getDataFromToken(req); // Extract user from token
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { flightId, seats, paymentStatus = "Paid" } = body;

    if (!flightId || !seats || !Array.isArray(seats)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const bookings = await Promise.all(
      seats.map(seat =>
        Booking.create({
          user: userId,
          flight: flightId,
          seatNumber: seat,
          paymentStatus,
          status: "Booked",
        })
      )
    );

    return NextResponse.json({ message: "Tickets created", bookings }, { status: 201 });

  } catch (err: any) {
    console.error("Booking error:", err.message);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
