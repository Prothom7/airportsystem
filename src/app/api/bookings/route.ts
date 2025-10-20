import { NextResponse } from 'next/server';
import Booking from '@/models/reservationModel';
import { connect } from '@/dbConnection/dbConnection';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    console.log('API /api/bookings called');
    await connect();
    console.log('Database connected');

    const { searchParams } = new URL(req.url);
    const flightId = searchParams.get('flightId');

    if (!flightId) {
      console.log('No flightId in query');
      return NextResponse.json({ error: 'Missing flightId parameter' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(flightId)) {
      console.log('Invalid flightId format:', flightId);
      return NextResponse.json({ error: 'Invalid flightId format' }, { status: 400 });
    }

    console.log('Fetching bookings for flightId:', flightId);
    const bookings = await Booking.find({ flight: flightId })  // you can pass the string, Mongoose should cast
      .select('seatNumber paymentStatus status')
      .lean();

    console.log('Bookings found:', bookings.length, bookings);

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Unhandled error in API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
