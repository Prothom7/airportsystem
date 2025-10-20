'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  name: string;
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

  // Load data from localStorage
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

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed: User = JSON.parse(userData);
        setUser(parsed);
      } catch (err) {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

  // Fetch flight details
  useEffect(() => {
    const fetchFlight = async () => {
      if (!checkoutData?.flightId) return;

      try {
        const res = await fetch(`/api/flights/${checkoutData.flightId}`);
        if (!res.ok) {
          throw new Error('Flight not found');
        }
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

      const result = await res.json();
      console.log('Booking result:', result);

      alert('Payment confirmed and ticket created!');
      localStorage.removeItem('checkoutData');
      router.push('/confirmation');

    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed');
    }
  };

  if (loading) return <p>Loading checkout summary...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!checkoutData || !flight) return <p>Invalid data</p>;

  return (
    <div>
      <h1>Flight Ticket Summary</h1>

      <h2>Flight Information</h2>
      <p><strong>Flight:</strong> {flight.flightNumber} ({flight.airline.name})</p>
      <p><strong>From:</strong> {flight.departureAirport.city} ({flight.departureAirport.name})</p>
      <p><strong>To:</strong> {flight.arrivalAirport.city} ({flight.arrivalAirport.name})</p>
      <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
      <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
      <p><strong>Status:</strong> {flight.status}</p>

      <h2>Selected Seats</h2>
      <ul>
        {checkoutData.seats.map(seat => (
          <li key={seat}>Seat: {seat}</li>
        ))}
      </ul>
      <p><strong>Total Price:</strong> ${checkoutData.totalPrice.toFixed(2)}</p>

      <h2>User Information</h2>
      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </>
      ) : (
        <p>No user info available</p>
      )}

      <h2>Payment Method</h2>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="upi">UPI</option>
      </select>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleConfirmPayment}>Confirm & Pay</button>
      </div>
    </div>
  );
}
