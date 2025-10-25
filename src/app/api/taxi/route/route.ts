import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConnection/dbConnection";
import Taxi from "@/models/taxiModel";

connect(); // connect to MongoDB

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      pickup,
      dropoff,
      pickupTime,
      price,
      pickupCoords,
      dropoffCoords,
      userId,
    } = data;

    // Validate
    if (!pickup || !dropoff || !pickupTime || !price || !pickupCoords || !dropoffCoords || !userId) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    // Haversine formula to calculate distance
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(dropoffCoords[0] - pickupCoords[0]);
    const dLon = toRad(dropoffCoords[1] - pickupCoords[1]);
    const lat1 = toRad(pickupCoords[0]);
    const lat2 = toRad(dropoffCoords[0]);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Save booking
    const booking = new Taxi({
      user: userId,
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      pickupTime: new Date(pickupTime),
      price,
      status: "Pending",
      paymentStatus: "Pending",
    });
    await booking.save();

    return NextResponse.json({ success: true, distance });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
