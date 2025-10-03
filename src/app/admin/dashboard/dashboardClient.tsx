'use client';

import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

interface DashboardClientProps {
  userName: string;
}

export default function DashboardClient({ userName }: DashboardClientProps) {
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

      <div className={styles.container}>
        <h1 className={styles.title}>Welcome, {userName}</h1>
        <p>Select a section from the menu above to manage the data.</p>
      </div>
    </div>
  );
}
