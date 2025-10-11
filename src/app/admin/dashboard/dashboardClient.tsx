'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FlightType } from '@/services/flightService';
import styles from './dashboard.module.css';

interface Props {
  userName: string;
  flights: FlightType[];
}

export default function DashboardClient({ userName, flights }: Props) {
  const router = useRouter();

  return (
    <div className={styles.fullpage}>
      <nav className={styles.navbar}>
        <a className={styles.navItem} onClick={() => router.push('/admin/airport/new')}>
          Airport
        </a>
        <a className={styles.navItem} onClick={() => router.push('/admin/aircraft/new')}>
          Aircraft
        </a>
        <a className={styles.navItem} onClick={() => router.push('/admin/user/new')}>
          User
        </a>
        <a className={styles.navItem} onClick={() => router.push('/admin/airline/new')}>
          Airline
        </a>
        <a className={styles.navItem} onClick={() => router.push('/admin/flight/new')}>
          Flight
        </a>
        <a className={styles.navItem} onClick={() => router.push('/admin/reservation/new')}>
          Reservation
        </a>
      </nav>

      <main className={styles.container}>
        <section className={styles.welcomeSection}>
          <h1 className={styles.title}>Welcome, {userName}!</h1>
        </section>

        <section className={styles.tableSection}>
          <h2 className={styles.title}>Flight List</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Flight Number</th>
                <th>Airline</th>
                <th>Aircraft</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Status</th>
                <th>Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight._id}>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.airline.name}</td>
                  <td>{flight.aircraft.model}</td>
                  <td>{new Date(flight.departureTime).toLocaleString()}</td>
                  <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                  <td>{flight.status}</td>
                  <td>{flight.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
