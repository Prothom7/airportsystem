'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './flightSearch.module.css';

interface Flight {
  _id: string;
  flightNumber: string;
  airline: {
    name: string;
  };
  departureAirport: {
    name: string;
    city: string;
  };
  arrivalAirport: {
    name: string;
    city: string;
  };
  departureTime: string;
  arrivalTime: string;
  status: string;
  price: number;
}

export default function FlightSearchPage() {
  const [airline, setAirline] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchFlights = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (airline) params.append('airline', airline);
      if (destination) params.append('destination', destination);
      if (departureDate) params.append('departureDate', departureDate);

      const res = await fetch(`/api/flights/search?${params.toString()}`);
      const data: Flight[] = await res.json();

      let filtered = data;
      if (departureDate) {
        filtered = data.filter((flight) => {
          const flightDate = new Date(flight.departureTime).toISOString().slice(0, 10);
          return flightDate === departureDate;
        });
      }

      setFlights(filtered);
    } catch (err) {
      console.error('Failed to fetch flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (flight: Flight) => {
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    router.push('/flights/booking');
  };

  return (
    <div className={styles.fullpage}>
    <div className={styles.container}>
      <h1 className={styles.title}>Flight Search</h1>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Destination city or airport"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="text"
          placeholder="Airline"
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
        />
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
        <button onClick={searchFlights}>Search</button>
      </div>

      {loading && <p>Loading flights...</p>}

      {!loading && flights.length > 0 && (
        <ul className={styles.flightList}>
          {flights.map((flight) => (
            <li key={flight._id} className={styles.flightCard}>
              <div className={styles.cardLeft}>
                <div className={styles.route}>
                  <span className={styles.airportCode}>
                    {flight.departureAirport.name.split(' ')[0].toUpperCase()}
                  </span>
                  <span>{flight.departureAirport.city}</span>
                  <span className={styles.airplaneIcon}> to </span>
                  <span className={styles.airportCode}>
                    {flight.arrivalAirport.name.split(' ')[0].toUpperCase()}
                  </span>
                  <span>{flight.arrivalAirport.city}</span>
                </div>
                <div className={styles.times}>
                  <p>
                    <b>Departure:</b>{' '}
                    {new Date(flight.departureTime).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  <p>
                    <b>Arrival:</b>{' '}
                    {new Date(flight.arrivalTime).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  <p>
                    <b>Status:</b> {flight.status}
                  </p>
                </div>
              </div>

              <div className={styles.cardRight}>
                <div className={styles.price}>
                  ${flight.price.toFixed(2)}
                  <span className={styles.currency}> USD</span>
                </div>
                <button
                  className={styles.bookButton}
                  onClick={() => handleBookNow(flight)}
                  aria-label={`Book flight ${flight.flightNumber}`}
                >
                  Book Now
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && flights.length === 0 && <p>No flights found.</p>}
    </div>
    </div>
  );
}
