'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './airlineNew.module.css'; 

export default function NewAirlinePage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [country, setCountry] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/airline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code, country }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Airline added successfully!');
      router.push('/admin/dashboard');
    } else {
      alert(data.error || 'Error adding airline.');
    }
  };

  return (
    <div className={styles.fullpage}>
      <div className={styles.container}>
        <h2 className={styles.title}>Add Airline</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Airline Name" required />
          <input className={styles.input} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Airline Code" required />
          <input className={styles.input} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" required />
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </div>
    </div>
  );
}
