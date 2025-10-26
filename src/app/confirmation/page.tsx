'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './confirmation.module.css';

export default function ConfirmationPage() {
  const router = useRouter();

  const goHome = () => {
    router.push('/');
  };

  return (
    <>
      <Header />
      <div className={styles.fullpage}>
        <div className={styles.container}>
          <h1 className={styles.title}>Booking Confirmed!</h1>
          <p className={styles.message}>
            Thank you for your purchase. Your flight ticket has been successfully booked.
          </p>
          <button className={styles.homeBtn} onClick={goHome}>
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
