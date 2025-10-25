"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import styles from "./checkin.module.css";

interface FlightData {
  _id: string;
  flight: {
    flightNumber: string;
    departureTime: string;
  };
}

export default function CheckInPage() {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch("/api/checkin");
        const data = await res.json();
        if (data.eligible) {
          setFlights(data.flights);
        } else {
          setMessage("No flights available for check-in at this time.");
        }
      } catch (err) {
        setMessage("Failed to fetch flights. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleCheckIn = async (bookingId: string) => {
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setFlights(flights.filter((f) => f._id !== bookingId));
    } catch (err) {
      setMessage("Check-in failed. Please try again.");
    }
  };

  if (loading)
    return (
      <div className={styles.checkinContainer}>
        <Header />
        <div className={styles.loadingScreen}>
          <div className={styles.loader}></div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className={styles.checkinContainer}>
      <Header />
      <main className={styles.mainContent}>
        <h1>Online Check-In</h1>
        {message && <p className={styles.message}>{message}</p>}
        {flights.length > 0 ? (
          <ul className={styles.flightList}>
            {flights.map((f) => (
              <li key={f._id} className={styles.flightCard}>
                <div className={styles.flightInfo}>
                  <p>Flight: {f.flight.flightNumber}</p>
                  <p>
                    Departure:{" "}
                    {new Date(f.flight.departureTime).toLocaleString()}
                  </p>
                </div>
                <button
                  className={styles.checkInBtn}
                  onClick={() => handleCheckIn(f._id)}
                >
                  Check In
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyText}>No flights available for check-in.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
