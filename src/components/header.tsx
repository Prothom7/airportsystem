import Link from 'next/link';
import React from 'react';
import styles from './header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>AirportName</div>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>Home</Link>

        <div className={styles.dropdown}>
          <Link href="/flights" className={styles.navLink}>
            Flights
          </Link>
          <div className={styles.dropdownContent}>
            <Link href="/flights/arrivals" className={styles.dropdownLink}>Arrivals</Link>
            <Link href="/flights/departures" className={styles.dropdownLink}>Departures</Link>
          </div>
        </div>

        <Link href="/book-flight" className={styles.navLink}>Book Flight</Link>

        <div className={styles.dropdown}>
          <Link href="/services" className={styles.navLink}>
            Services
          </Link>
          <div className={styles.dropdownContent}>
            <Link href="/services/online-checkin" className={styles.dropdownLink}>Online Check-in</Link>
            <Link href="/services/parking" className={styles.dropdownLink}>Parking</Link>
            <Link href="/services/lounge" className={styles.dropdownLink}>Lounges</Link>
          </div>
        </div>

        <Link href="/profile" className={styles.navLink}>Profile</Link>
        <Link href="/contact" className={styles.navLink}>Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
