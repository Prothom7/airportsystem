'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./reservationNew.module.css";

export default function NewReservationPage() {
  const [flight, setFlight] = useState(""); 
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [status, setStatus] = useState("Booked");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      flight,
      passengerName,
      passengerEmail,
      seatNumber,
      status,
    };

    const res = await fetch("/api/admin/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      alert("Invalid server response");
      return;
    }

    if (res.ok) {
      alert("Reservation added successfully!");
      router.push("/admin/dashboard");
    } else {
      alert(data.error || "Something went wrong.");
    }
  };

  return (
    <div className={styles.fullpage}>
      <div className={styles.container}>
        <h2 className={styles.title}>Add New Reservation</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            value={flight}
            onChange={(e) => setFlight(e.target.value)}
            placeholder="Flight ID"
            className={styles.input}
            required
          />
          <input
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            placeholder="Passenger Name"
            className={styles.input}
            required
          />
          <input
            type="email"
            value={passengerEmail}
            onChange={(e) => setPassengerEmail(e.target.value)}
            placeholder="Passenger Email"
            className={styles.input}
            required
          />
          <input
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
            placeholder="Seat Number"
            className={styles.input}
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

          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
