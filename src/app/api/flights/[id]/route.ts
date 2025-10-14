import { NextResponse } from 'next/server';
import Flight from '@/models/flightModel';
import { connect } from '@/dbConnection/dbConnection';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connect();

  try {
    const flight = await Flight.findById(params.id)
      .populate('aircraft')
      .populate('airline')
      .populate('departureAirport')
      .populate('arrivalAirport')
      .lean();

    if (!flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json(flight);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
