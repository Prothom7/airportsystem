'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './reservationNew.module.css';

export default function NewReservationPage() {
  const [user, setUser] = useState(''); // user ID
  const [flight, setFlight] = useState(''); // flight ID
  const [seatNumber, setSeatNumber] = useState('');
  const [status, setStatus] = useState('Booked');
  const [paymentStatus, setPaymentStatus] = useState('Pending');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      user,
      flight,
      seatNumber,
      status,
      paymentStatus,
    };

    const res = await fetch('/api/admin/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      alert('Invalid server response');
      return;
    }

    if (res.ok) {
      alert('Reservation added successfully!');
      router.push('/admin/dashboard');
    } else {
      alert(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className={styles.fullpage}>
      <div className={styles.container}>
        <h2 className={styles.title}>Add New Reservation</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="User ID"
            className={styles.input}
            required
          />
          <input
            value={flight}
            onChange={(e) => setFlight(e.target.value)}
            placeholder="Flight ID"
            className={styles.input}
            required
          />
          <input
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
            placeholder="Seat Number"
            className={styles.input}
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.input}
          >
            <option value="Booked">Booked</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className={styles.input}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
          </select>

          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
