'use client';

import { useEffect, useState } from 'react';
import styles from './booking.module.css';

interface Seat {
  seatNumber: string;
  class: 'Economy' | 'Business' | 'First';
}

interface Flight {
  _id: string;
  flightNumber: string;
  airline: { name: string };
  departureAirport: { name: string; city: string };
  arrivalAirport: { name: string; city: string };
  departureTime: string;
  arrivalTime: string;
  status: string;
  price: number;
  aircraft: {
    model: string;
    manufacturer: string;
    registrationNumber: string;
    capacity: number;
    inService: boolean;
    seats: Seat[];
  };
}

export default function BookingPage() {
  const [flightId, setFlightId] = useState<string | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedFlight = localStorage.getItem('selectedFlight');
    if (savedFlight) {
      const parsedFlight = JSON.parse(savedFlight);
      setFlightId(parsedFlight._id);
    } else {
      setError('No flight selected. Please go back and choose a flight.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!flightId) return;

    async function fetchFlight() {
      setLoading(true);
      try {
        const res = await fetch(`/api/flights/${flightId}`);
        if (!res.ok) throw new Error('Failed to fetch flight');
        const data: Flight = await res.json();
        setFlight(data);
      } catch (err) {
        setError('Failed to load flight data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFlight();
  }, [flightId]);

  const seatsByRow = flight?.aircraft?.seats?.reduce<Record<string, Seat[]>>((acc, seat) => {
    const row = seat.seatNumber.match(/\d+/)?.[0] || 'Unknown';
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {}) || {};

  const toggleSeatSelection = (seatNumber: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  if (loading) return <p>Loading flight data...</p>;
  if (error) return <p>{error}</p>;
  if (!flight) return null;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Booking Flight: {flight.flightNumber}</h1>
      <p><strong>Airline:</strong> {flight.airline.name}</p>
      <p><strong>From:</strong> {flight.departureAirport.city} ({flight.departureAirport.name})</p>
      <p><strong>To:</strong> {flight.arrivalAirport.city} ({flight.arrivalAirport.name})</p>
      <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
      <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
      <p><strong>Status:</strong> {flight.status}</p>
      <p><strong>Price:</strong> ${flight.price.toFixed(2)}</p>

      <h2>Seat Selection</h2>
      <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '600px' }}>
        {Object.entries(seatsByRow)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([row, seats]) => (
            <div key={row} className={styles.seatsRowContainer}>
              <strong className={styles.rowLabel}>Row {row}</strong>
              <div className={styles.seatsRow}>
                {seats.map((seat) => {
                  const selected = selectedSeats.includes(seat.seatNumber);
                  let className = '';

                  switch (seat.class) {
                    case 'Economy':
                      className = styles.economy;
                      break;
                    case 'Business':
                      className = styles.business;
                      break;
                    case 'First':
                      className = styles.first;
                      break;
                  }

                  return (
                    <button
                      key={seat.seatNumber}
                      onClick={() => toggleSeatSelection(seat.seatNumber)}
                      className={`${styles.seatButton} ${className} ${selected ? styles.selected : ''}`}
                      aria-pressed={selected}
                      title={`${seat.seatNumber} (${seat.class})`}
                    >
                      {seat.seatNumber}
                      <small className={styles.seatClassLabel}>{seat.class}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
      </div>
    </div>
  );
}
