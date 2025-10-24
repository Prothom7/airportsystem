import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/reservationModel";
import User from "@/models/userModel";
import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { sendConfirmationEmail } from "@/helpers/mailer";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const userId = getDataFromToken(req);
    if (!userId) {
      console.warn("Unauthorized: No user ID in token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { flightId, seats, paymentStatus = "Paid", flightNumber, totalPrice } = body;

    if (!flightId || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Booking for user:", user.email);

    const bookings = await Promise.all(
      seats.map(seat =>
        Booking.create({
          user: userId,
          flight: flightId,
          seatNumber: seat,
          paymentStatus,
          status: "Booked",
          flightNumber: flightNumber || "",
        })
      )
    );

    console.log("Attempting to send confirmation email...");

    try {
      const emailResponse = await sendConfirmationEmail(
        user.email,
        user.username,
        seats,
        totalPrice
      );

      console.log("Email sent via nodemailer: ", emailResponse?.response || "Check Mailtrap");
    } catch (emailErr: any) {
      console.error("Error sending email:", emailErr.message);
    }

    return NextResponse.json({ message: "Tickets booked", bookings }, { status: 201 });
  } catch (err: any) {
    console.error("Booking error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
