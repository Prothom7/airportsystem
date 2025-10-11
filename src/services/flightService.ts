import Flight from '@/models/flightModel';
import '@/models/aircraftModel';
import '@/models/airlineModel';
import '@/models/airportModel';
import { connect } from '@/dbConnection/dbConnection';

export interface FlightType {
  _id: string;
  flightNumber: string;
  aircraft: {
    model: string;
    manufacturer: string;
    registrationNumber: string;
    capacity: number;
    airline: string | object;
    inService: boolean;
  };
  airline: {
    name: string;
    code: string;
    country: string;
  };
  departureAirport: {
    name: string;
    city: string;
    country: string;
    iataCode: string;
    icaoCode: string;
    timezone: string;
  };
  arrivalAirport: {
    name: string;
    city: string;
    country: string;
    iataCode: string;
    icaoCode: string;
    timezone: string;
  };
  departureTime: Date;
  arrivalTime: Date;
  status: string;
  price: number;
}

export async function getAllFlights(): Promise<FlightType[]> {
  await connect();

  const flights = await Flight.find()
    .populate('aircraft', 'model manufacturer registrationNumber capacity airline inService')
    .populate('airline', 'name code country')
    .populate('departureAirport', 'name city country iataCode icaoCode timezone')
    .populate('arrivalAirport', 'name city country iataCode icaoCode timezone')
    .lean<FlightType[]>();

  return flights;
}

export async function searchFlights(query: {
  airline?: string;
  destination?: string;
}): Promise<FlightType[]> {
  await connect();

  const flights = await Flight.find()
    .populate('aircraft', 'model manufacturer registrationNumber capacity airline inService')
    .populate('airline', 'name code country')
    .populate('departureAirport', 'name city country iataCode icaoCode timezone')
    .populate('arrivalAirport', 'name city country iataCode icaoCode timezone')
    .lean<FlightType[]>();

  const filtered = flights.filter((flight) => {
    const airlineMatch = query.airline
      ? flight.airline?.name?.toLowerCase().includes(query.airline.toLowerCase())
      : true;

    const destinationMatch = query.destination
      ? (
          flight.arrivalAirport?.city?.toLowerCase().includes(query.destination.toLowerCase()) ||
          flight.arrivalAirport?.name?.toLowerCase().includes(query.destination.toLowerCase())
        )
      : true;

    return airlineMatch && destinationMatch;
  });

  return filtered;
}
