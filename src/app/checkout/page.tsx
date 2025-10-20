'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './checkout.module.css';

interface CheckoutData {
  flightId: string;
  seats: string[];
  totalPrice: number;
}

interface Flight {
  flightNumber: string;
  airline: { name: string };
  departureAirport: { name: string; city: string };
  arrivalAirport: { name: string; city: string };
  departureTime: string;
  arrivalTime: string;
  status: string;
  price: number;
}

interface User {
  username: string;
  email: string;
}

export default function CheckoutPage() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('checkoutData');
    if (saved) {
      try {
        const parsed: CheckoutData = JSON.parse(saved);
        setCheckoutData(parsed);
      } catch (err) {
        setError('Invalid checkout data');
      }
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/aboutme', { method: 'POST' });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error('User fetch error:', err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!checkoutData?.flightId) return;
      try {
        const res = await fetch(`/api/flights/${checkoutData.flightId}`);
        if (!res.ok) throw new Error('Flight not found');
        const data: Flight = await res.json();
        setFlight(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load flight details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [checkoutData]);

  const handleConfirmPayment = async () => {
    if (!checkoutData) return;

    try {
      const res = await fetch('/checkout/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId: checkoutData.flightId,
          seats: checkoutData.seats,
          paymentStatus: 'Paid',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert('Failed to book seats: ' + errData.error);
        return;
      }

      alert('Payment confirmed and ticket created!');
      localStorage.removeItem('checkoutData');
      router.push('/confirmation');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed');
    }
  };

  if (loading) return <p className={styles.loading}>Loading checkout summary...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!checkoutData || !flight) return <p className={styles.error}>Invalid data</p>;

  return (
    <>
      <Header />

      <div className={styles.fullpage}>
        <div className={styles.container}>
          <h1>Flight Ticket Summary</h1>

          <div className={styles.section}>
            <h2>Flight Information</h2>
            <p>
              <strong>Flight:</strong> {flight.flightNumber} ({flight.airline.name})
            </p>
            <p>
              <strong>From:</strong> {flight.departureAirport.city} ({flight.departureAirport.name})
            </p>
            <p>
              <strong>To:</strong> {flight.arrivalAirport.city} ({flight.arrivalAirport.name})
            </p>
            <p>
              <strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}
            </p>
            <p>
              <strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {flight.status}
            </p>
          </div>

          <div className={styles.section}>
            <h2>Selected Seats</h2>
            <ul className={styles.seatsList}>
              {checkoutData.seats.map((seat) => (
                <li key={seat}>Seat: {seat}</li>
              ))}
            </ul>
            <p className={styles.totalPrice}>
              <strong>Total Price:</strong> ${checkoutData.totalPrice.toFixed(2)}
            </p>
          </div>

          <div className={styles.section}>
            <h2>User Information</h2>
            {user ? (
              <>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </>
            ) : (
              <p>Loading user info or user not authenticated.</p>
            )}
          </div>

          <div className={styles.section}>
            <h2>Payment Method</h2>
            <select
              className={styles.selectPayment}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <button className={styles.confirmBtn} onClick={handleConfirmPayment}>
            Confirm &amp; Pay
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
