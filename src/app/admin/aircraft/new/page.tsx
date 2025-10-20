'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './aircraftNew.module.css';

const seatClasses = ["Economy", "Business", "First"];

export default function NewAircraftPage() {
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [airline, setAirline] = useState('');
  const [inService, setInService] = useState(true);

  const [seats, setSeats] = useState([
    { seatNumber: '', class: 'Economy' }
  ]);

  const router = useRouter();

  const handleSeatChange = (index: number, field: string, value: string) => {
    const newSeats = [...seats];
    newSeats[index] = { ...newSeats[index], [field]: value };
    setSeats(newSeats);
  };

  const addSeat = () => {
    setSeats([...seats, { seatNumber: '', class: 'Economy' }]);
  };

  const removeSeat = (index: number) => {
    setSeats(seats.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/aircraft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, manufacturer, registrationNumber, capacity: Number(capacity), airline, inService, seats })
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

          <div>
            <h3>Seats</h3>
            {seats.map((seat, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Seat Number"
                  value={seat.seatNumber}
                  onChange={(e) => handleSeatChange(index, 'seatNumber', e.target.value)}
                  required
                  className={styles.input}
                  style={{ flex: '1' }}
                />
                <select
                  value={seat.class}
                  onChange={(e) => handleSeatChange(index, 'class', e.target.value)}
                  required
                  className={styles.input}
                  style={{ width: '140px' }}
                >
                  {seatClasses.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <button type="button" onClick={() => removeSeat(index)} style={{ cursor: 'pointer' }}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addSeat} style={{ marginTop: '8px', cursor: 'pointer' }}>
              Add Seat
            </button>
          </div>

          <button type="submit" className={styles.button} style={{ marginTop: '1rem' }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
