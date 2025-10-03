'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './airportNew.module.css'; // Adjust path if needed

export default function NewAirportPage() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [iataCode, setIataCode] = useState('');
  const [icaoCode, setIcaoCode] = useState('');
  const [timezone, setTimezone] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/airport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, city, country, iataCode, icaoCode, timezone })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Airport added successfully!');
      router.push('/admin/dashboard');
    } else {
      alert(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className={styles.fullpage}>
      <div className={styles.container}>
        <h2 className={styles.title}>Add New Airport</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Airport Name" className={styles.input} required />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={styles.input} required />
          <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className={styles.input} required />
          <input value={iataCode} onChange={(e) => setIataCode(e.target.value.toUpperCase())} placeholder="IATA Code" className={styles.input} required maxLength={3} />
          <input value={icaoCode} onChange={(e) => setIcaoCode(e.target.value.toUpperCase())} placeholder="ICAO Code" className={styles.input} required maxLength={4} />
          <input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Timezone (e.g. America/New_York)" className={styles.input} required />
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </div>
    </div>
  );
}
