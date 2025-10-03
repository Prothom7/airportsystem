'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './aircraftNew.module.css'; 

export default function NewAircraftPage() {
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [airline, setAirline] = useState('');
  const [inService, setInService] = useState(true);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/aircraft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, manufacturer, registrationNumber, capacity, airline, inService })
    });

    let data;
    try {
      data = await res.json();
    } catch {
      alert('Invalid response from server.');
      return;
    }

    if (res.ok) {
      alert('Aircraft added successfully!');
      router.push('/admin/dashboard');
    } else {
      alert(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className={styles.fullpage}>
      <div className={styles.container}>
        <h2 className={styles.title}>Add New Aircraft</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className={styles.input}
            required
          />
          <input
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="Manufacturer"
            className={styles.input}
            required
          />
          <input
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="Registration Number"
            className={styles.input}
            required
          />
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Capacity"
            className={styles.input}
            required
          />
          <input
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            placeholder="Airline"
            className={styles.input}
            required
          />

          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={inService}
              onChange={(e) => setInService(e.target.checked)}
            />
            In Service
          </label>

          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
