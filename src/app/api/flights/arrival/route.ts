import { NextResponse } from 'next/server';
import { getAllFlights, FlightType } from '@/services/flightService';

export async function GET() {
  try {
    const airportId = '68de3e8a99ca8b872694cead';

    const allFlights: FlightType[] = await getAllFlights();

    // Use today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of day
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // end of day

    // Filter flights arriving today at the specified airport
    const flightsToday = allFlights.filter(flight => {
      const arrivalAirportId = flight.arrivalAirport._id?.toString() || flight.arrivalAirport.toString();
      const arrivalTime = new Date(flight.arrivalTime);
      return (
        arrivalAirportId === airportId &&
        arrivalTime >= today &&
        arrivalTime <= endOfDay
      );
    });

    return NextResponse.json({ flights: flightsToday });
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json(
      { error: 'Failed to load arrival flights' },
      { status: 500 }
    );
  }
}
