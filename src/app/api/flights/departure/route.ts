import { NextResponse } from 'next/server';
import { getAllFlights, FlightType } from '@/services/flightService';

export async function GET() {
  try {
    const airportId = '68de3e8a99ca8b872694cead';

    const allFlights: FlightType[] = await getAllFlights();

    // Use today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter flights departing today from the specified airport
    const flightsToday = allFlights.filter(flight => {
      const departureAirportId = flight.departureAirport._id?.toString() || flight.departureAirport.toString();
      const departureTime = new Date(flight.departureTime);
      return (
        departureAirportId === airportId &&
        departureTime >= today &&
        departureTime <= endOfDay
      );
    });

    return NextResponse.json({ flights: flightsToday });
  } catch (error) {
    console.error('Error fetching departure flights:', error);
    return NextResponse.json(
      { error: 'Failed to load departure flights' },
      { status: 500 }
    );
  }
}
