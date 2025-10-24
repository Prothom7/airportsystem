'use client';

import React, { useEffect, useState } from 'react';

interface Airline {
  name: string;
}

interface Airport {
  name: string;
  city: string;
}

interface Flight {
  _id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  price: number;
  airline?: Airline;
  departureAirport?: Airport;
}

export default function ArrivalFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch('/api/flights/arrival');
        if (!res.ok) throw new Error('Failed to fetch flights');

        const data = await res.json();
        setFlights(data.flights || []);
      } catch (err: any) {
        console.error('Error fetching flights:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) return <p>Loading arrival flights...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (flights.length === 0) return <p>No flights arriving today.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Today's Arrivals</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {flights.map((flight) => (
          <li
            key={flight._id}
            style={{
              marginBottom: '1rem',
              border: '1px solid #ddd',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <h2>{flight.flightNumber}</h2>
            <p>
              <strong>Status:</strong> {flight.status}
            </p>
            <p>
              <strong>Airline:</strong> {flight.airline?.name ?? 'Unknown'}
            </p>
            <p>
              <strong>From:</strong> {flight.departureAirport?.name ?? 'Unknown'} (
              {flight.departureAirport?.city ?? 'Unknown'})
            </p>
            <p>
              <strong>Arrival Time:</strong>{' '}
              {new Date(flight.arrivalTime).toLocaleString()}
            </p>
            <p>
              <strong>Price:</strong> ${flight.price}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
