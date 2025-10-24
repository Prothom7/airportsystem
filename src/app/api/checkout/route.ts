import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/reservationModel";
import User from "@/models/userModel";
import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const userId = getDataFromToken(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { flightId, seats, paymentStatus = "Paid", flightNumber, totalPrice } = body;

    if (!flightId || !Array.isArray(seats) || seats.length === 0 || !totalPrice) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const bookings = await Promise.all(
      seats.map(seat => Booking.create({
        user: userId,
        flight: flightId,
        seatNumber: seat,
        paymentStatus,
        status: "Booked",
        flightNumber: flightNumber || "",
      }))
    );

    try {
      const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
        port: Number(process.env.MAILTRAP_PORT) || 2525,
        auth: {
          user: process.env.MAILTRAP_USER || "881adce8eef45a",
          pass: process.env.MAILTRAP_PASS || "c668c78e490a94",
        },
      });

      await transport.sendMail({
        from: "prothomghosh41@gmail.com",
        to: user.email,
        subject: `Booking Confirmation - Flight ${flightNumber}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 30px; border-radius: 12px; background-color: #fafafa;">
            <h2 style="color: #0a3d62; text-align: center; margin-bottom: 20px;">Flight Ticket Confirmation</h2>
            <p style="text-align: center; margin-bottom: 30px;">Hi <strong>${user.username}</strong>, your booking is confirmed.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;"><strong>Flight Number</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${flightNumber}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;"><strong>Seats</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${seats.join(", ")}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;"><strong>Total Price</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">$${totalPrice}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;"><strong>Status</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">Confirmed</td>
              </tr>
            </table>

            <p style="text-align: center; font-weight: 500; margin-bottom: 5px;">Purchased from KUET Airport</p>
            <p style="text-align: center; font-size: 12px; color: #777;">If you have any questions, reply to this email or contact our support team.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Email sending error:", err);
    }

    return NextResponse.json({ message: "Tickets booked", bookings }, { status: 201 });

  } catch (err: any) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
