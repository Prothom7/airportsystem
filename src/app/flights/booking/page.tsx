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

interface BookingStatus {
  seatNumber: string;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
}

export default function BookingPage() {
  const [flightId, setFlightId] = useState<string | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [bookings, setBookings] = useState<BookingStatus[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load flightId from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedFlight');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed._id) {
          setFlightId(parsed._id);
        } else {
          console.error('selectedFlight missing _id field:', parsed);
          setError('Invalid flight data stored.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to parse selectedFlight from localStorage:', err);
        setError('Invalid flight data in storage.');
        setLoading(false);
      }
    } else {
      setError('No flight selected. Please choose a flight first.');
      setLoading(false);
    }
  }, []);

  console.log('Using flightId:', flightId); // Add this just before fetchBookings


  // Fetch flight details
  useEffect(() => {
    if (!flightId) return;

    const fetchFlight = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/flights/${flightId}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to fetch flight');
        }
        const data: Flight = await res.json();
        setFlight(data);
      } catch (err) {
        console.error('Error fetching flight:', err);
        setError('Unable to load flight details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [flightId]);

  // Fetch bookings / reserved seats
  useEffect(() => {
    if (!flightId) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?flightId=${flightId}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to fetch bookings');
        }
        const data: BookingStatus[] = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Could not load booking data.');
      }
    };

    fetchBookings();
  }, [flightId]);

  // Group seats by row number
  const seatsByRow: Record<string, Seat[]> = flight?.aircraft?.seats?.reduce((acc, seat) => {
    const match = seat.seatNumber.match(/\d+/);
    const row = match ? match[0] : '0';
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>) || {};

  // Return the booking status (if any) of a seat
  const getSeatBookingStatus = (seatNumber: string): BookingStatus['paymentStatus'] | null => {
    const booking = bookings.find(b => b.seatNumber === seatNumber);
    return booking ? booking.paymentStatus : null;
  };

  // Toggle selection (unless already reserved)
  const toggleSeatSelection = (seatNumber: string) => {
    const status = getSeatBookingStatus(seatNumber);
    if (status === 'Pending' || status === 'Paid') {
      return; // disallow selecting reserved seats
    }
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < 4) {
        setSelectedSeats(prev => [...prev, seatNumber]);
      } else {
        // optionally inform user they can't select more than 4
      }
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (!flight) return;
    const checkoutData = {
      flightId: flight._id,
      seats: selectedSeats,
      totalPrice: flight.price * selectedSeats.length,
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    window.location.href = '/checkout';
  };

  if (loading) {
    return <p className={styles.statusMessage}>Loading...</p>;
  }
  if (error) {
    return <p className={styles.statusMessage}>{error}</p>;
  }
  if (!flight) {
    return null;
  }

  const totalPrice = flight.price * selectedSeats.length;

  return (
    <div className={styles.fullpage}>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Booking Flight: {flight.flightNumber}</h1>

        <div className={styles.ticketContainer}>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Flight Number:</span>
            <span className={styles.ticketValue}>{flight.flightNumber}</span>
          </div>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Airline:</span>
            <span className={styles.ticketValue}>{flight.airline.name}</span>
          </div>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>From:</span>
            <span className={styles.ticketValue}>
              {flight.departureAirport.city} ({flight.departureAirport.name})
            </span>
          </div>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>To:</span>
            <span className={styles.ticketValue}>
              {flight.arrivalAirport.city} ({flight.arrivalAirport.name})
            </span>
          </div>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Departure:</span>
            <span className={styles.ticketValue}>
              {new Date(flight.departureTime).toLocaleString()}
            </span>
          </div>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Arrival:</span>
            <span className={styles.ticketValue}>
              {new Date(flight.arrivalTime).toLocaleString()}
            </span>
          </div>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Status:</span>
            <span className={styles.ticketValue}>{flight.status}</span>
          </div>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Price (per seat):</span>
            <span className={styles.ticketValue}>${flight.price.toFixed(2)}</span>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Seat Selection</h2>
        <div className={styles.seatSelectionContainer}>
          {Object.entries(seatsByRow)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([row, seats]) => (
              <div key={row} className={styles.seatsRowContainer}>
                <strong className={styles.rowLabel}>Row {row}</strong>
                <div className={styles.seatsRow}>
                  {seats.map(seat => {
                    const selected = selectedSeats.includes(seat.seatNumber);
                    const bookingStatus = getSeatBookingStatus(seat.seatNumber);

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

                    let disabled = false;
                    if (bookingStatus === 'Pending') {
                      className = styles.pending;
                      disabled = true;
                    } else if (bookingStatus === 'Paid') {
                      className = styles.paid;
                      disabled = true;
                    }

                    return (
                      <button
                        key={seat.seatNumber}
                        className={`${styles.seatButton} ${className} ${selected ? styles.selected : ''}`}
                        onClick={() => toggleSeatSelection(seat.seatNumber)}
                        type="button"
                        aria-pressed={selected}
                        aria-label={
                          `Seat ${seat.seatNumber}, ${seat.class}` +
                          (selected ? ', selected' : '') +
                          (disabled ? ', reserved' : '')
                        }
                        disabled={disabled}
                      >
                        <span>{seat.seatNumber}</span>
                        <span className={styles.seatClassLabel}>{seat.class}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {selectedSeats.length > 0 ? (
            <>
              <p className={styles.selectedSeatsInfo}>
                Selected Seats: {selectedSeats.join(', ')}
              </p>
              <p className={styles.selectedSeatsInfo}>
                Total Price: ${totalPrice.toFixed(2)}
              </p>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={handleCheckout}
                  disabled={selectedSeats.length === 0}
                  className={styles.checkoutButton}
                  aria-disabled={selectedSeats.length === 0}
                >
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <p className={styles.selectedSeatsInfo}>No seats selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
