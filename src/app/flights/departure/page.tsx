'use client';

import React, { useEffect, useState } from 'react';

interface Flight {
  _id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  price: number;
  airline: {
    name: string;
  };
  arrivalAirport: {
    name: string;
    city: string;
  };
}

export default function DepartureFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlights() {
      try {
        const res = await fetch('/api/flights/departure');
        const data = await res.json();
        setFlights(data.flights || []);
      } catch (err) {
        console.error('Error fetching departure flights:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFlights();
  }, []);

  if (loading) return <p>Loading departure flights...</p>;

  if (flights.length === 0) return <p>No flights departing today.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Today's Departures</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {flights.map(flight => (
          <li
            key={flight._id}
            style={{
              marginBottom: '1rem',
              border: '1px solid #ddd',
              padding: '1rem',
              borderRadius: '8px'
            }}
          >
            <h2>{flight.flightNumber}</h2>
            <p><strong>Status:</strong> {flight.status}</p>
            <p><strong>Airline:</strong> {flight.airline?.name || 'Unknown'}</p>
            <p><strong>To:</strong> {flight.arrivalAirport?.name} ({flight.arrivalAirport?.city})</p>
            <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
            <p><strong>Price:</strong> ${flight.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
