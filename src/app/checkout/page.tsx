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
    if (!saved) {
      setError('No checkout data found');
      setLoading(false);
      return;
    }
    try {
      const parsed: CheckoutData = JSON.parse(saved);
      if (!parsed.flightId || !Array.isArray(parsed.seats) || parsed.seats.length === 0 || !parsed.totalPrice) {
        setError('Invalid checkout data');
      } else {
        setCheckoutData(parsed);
      }
    } catch {
      setError('Invalid checkout data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkoutData) return;
    fetch('/api/users/aboutme', { method: 'POST' })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch user'))
      .then(data => setUser(data.data))
      .catch(() => setUser(null));
  }, [checkoutData]);

  useEffect(() => {
    if (!checkoutData?.flightId) return;
    fetch(`/api/flights/${checkoutData.flightId}`)
      .then(res => res.ok ? res.json() : Promise.reject('Flight not found'))
      .then(data => setFlight(data))
      .catch(() => setError('Failed to load flight details.'));
  }, [checkoutData]);

  const handleConfirmPayment = async () => {
    if (!checkoutData || !flight) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId: checkoutData.flightId,
          seats: checkoutData.seats,
          paymentStatus: 'Paid',
          flightNumber: flight.flightNumber,
          totalPrice: checkoutData.totalPrice,
          paymentMethod,
        }),
      });
      if (!res.ok) {
        let errMsg = 'Unknown error';
        try { const data = await res.json(); errMsg = data.error || errMsg; } catch {}
        alert('Booking failed: ' + errMsg);
        setLoading(false);
        return;
      }
      alert('Payment confirmed and ticket created!');
      localStorage.removeItem('checkoutData');
      router.push('/confirmation');
    } catch {
      alert('Booking failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading checkout summary...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!checkoutData || !flight) return null;

  return (
    <>
      <Header />
      <div className={styles.fullpage}>
        <div className={styles.container}>
          <h1 className={styles.title}>Flight Ticket Summary</h1>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Flight Information</h2>
            <table className={styles.flightTable}>
              <tbody>
                <tr>
                  <td>Flight:</td>
                  <td>{flight.flightNumber} ({flight.airline.name})</td>
                </tr>
                <tr>
                  <td>From:</td>
                  <td>{flight.departureAirport.city} ({flight.departureAirport.name})</td>
                </tr>
                <tr>
                  <td>To:</td>
                  <td>{flight.arrivalAirport.city} ({flight.arrivalAirport.name})</td>
                </tr>
                <tr>
                  <td>Departure:</td>
                  <td>{new Date(flight.departureTime).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Arrival:</td>
                  <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>{flight.status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Selected Seats</h2>
            <ul className={styles.seatsList}>
              {checkoutData.seats.map(seat => <li key={seat}>Seat: {seat}</li>)}
            </ul>
            <p className={styles.totalPrice}><strong>Total Price:</strong> ${checkoutData.totalPrice.toFixed(2)}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>User Information</h2>
            {user ? (
              <>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </>
            ) : <p>Loading user info...</p>}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <select
              className={styles.selectPayment}
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              disabled={loading}
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <button
            className={styles.confirmBtn}
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
