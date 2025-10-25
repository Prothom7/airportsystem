// app/api/checkin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Booking from "@/models/reservationModel";
import Flight from "@/models/flightModel";

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const currentTime = new Date();
    const sixHoursLater = new Date(currentTime.getTime() + 6 * 60 * 60 * 1000);

    const eligibleBookings = await Booking.find({
      user: userId,
      status: "Booked"
    }).populate("flight");

    const checkinAvailable = eligibleBookings.filter((b: any) => {
      const depTime = new Date(b.flight.departureTime);
      return depTime > currentTime && depTime <= sixHoursLater;
    });

    return NextResponse.json({
      eligible: checkinAvailable.length > 0,
      flights: checkinAvailable
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ message: "Booking ID required" }, { status: 400 });
    }

    await connect();

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const flight = await Flight.findById(booking.flight);
    const currentTime = new Date();
    const sixHoursLater = new Date(currentTime.getTime() + 6 * 60 * 60 * 1000);
    if (!(flight.departureTime > currentTime && flight.departureTime <= sixHoursLater)) {
      return NextResponse.json({ message: "Check-in not yet available" }, { status: 400 });
    }

    booking.status = "Checked-in";
    await booking.save();

    return NextResponse.json({ message: "Check-in successful", booking });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
