'use client';

import React, { useEffect, useState } from 'react';
import styles from './arrival.module.css';

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
  departureAirport: {
    name: string;
    city: string;
  };
}

export default function ArrivalFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlights() {
      try {
        const res = await fetch('/api/flights/arrival');
        const data = await res.json();
        setFlights(data.flights || []);
      } catch (err) {
        console.error('Error fetching flights:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFlights();
  }, []);

  if (loading) return <p className={styles.loading}>Loading arrival flights...</p>;
  if (flights.length === 0) return <p className={styles.noFlights}>No flights arriving today.</p>;

  return (
    <div className={styles.fullpage}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Arrival Flights</h1>
        <div className={styles.tableWrapper}>
          <table className={styles.flightTable}>
            <thead>
              <tr>
                <th>Flight</th>
                <th>Airline</th>
                <th>From</th>
                <th>Arrival</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight._id} className={styles.flightRow}>
                  <td className={styles.flightNumber}>{flight.flightNumber}</td>
                  <td>{flight.airline?.name || 'Unknown'}</td>
                  <td>
                    {flight.departureAirport?.name} ({flight.departureAirport?.city})
                  </td>
                  <td>
                    {new Date(flight.arrivalTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className={`${styles.status} ${styles[flight.status] || ''}`}>
                    {flight.status}
                  </td>
                  <td>${flight.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
