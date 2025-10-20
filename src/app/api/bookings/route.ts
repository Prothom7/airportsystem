import { NextResponse } from 'next/server';
import Booking from '@/models/reservationModel';
import { connect } from '@/dbConnection/dbConnection';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const flightId = searchParams.get('flightId');

    if (!flightId) {
      return NextResponse.json({ error: 'Missing flightId parameter' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(flightId)) {
      return NextResponse.json({ error: 'Invalid flightId format' }, { status: 400 });
    }

    // Fetch only required fields to keep response clean
    const bookings = await Booking.find({ flight: flightId })
      .select('seatNumber paymentStatus') // Only these two are needed in BookingPage
      .lean();

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
