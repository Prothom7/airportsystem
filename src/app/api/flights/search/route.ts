import { NextResponse } from 'next/server';
import { searchFlights } from '@/services/flightService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const airline = searchParams.get('airline') || undefined;
  const destination = searchParams.get('destination') || undefined;

  try {
    const flights = await searchFlights({ airline, destination });
    return NextResponse.json(flights);
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
