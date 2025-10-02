'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './flightNew.module.css'; 

export default function NewFlightPage() {
  const [flightNumber, setFlightNumber] = useState("");
  const [airline, setAirline] = useState(""); // will store airline ObjectId string
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [aircraft, setAircraft] = useState(""); // ObjectId string
  const [status, setStatus] = useState("Scheduled");
  const [price, setPrice] = useState<number>(0);


  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      flightNumber,
      airline,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      aircraft,
      status,
      price,
    };

    const res = await fetch("/api/admin/flight", {
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
      alert("Flight added successfully!");
      router.push("/admin/dashboard");
    } else {
      alert(data.error || "Something went wrong.");
    }
  };

  return (
    <div className={styles.fullpage}>
      <div className={styles.container}>
        <h2 className={styles.title}>Add New Flight</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            placeholder="Flight Number"
            className={styles.input}
            required
          />
          <input
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            placeholder="Airline ID"
            className={styles.input}
            required
          />
          <input
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value.toUpperCase())}
            placeholder="Departure Airport Code"
            className={styles.input}
            required
          />
          <input
            value={arrivalAirport}
            onChange={(e) => setArrivalAirport(e.target.value.toUpperCase())}
            placeholder="Arrival Airport Code"
            className={styles.input}
            required
          />
          <input
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            placeholder="Departure Time"
            className={styles.input}
            required
          />
          <input
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            placeholder="Arrival Time"
            className={styles.input}
            required
          />
          <input
            value={aircraft}
            onChange={(e) => setAircraft(e.target.value)}
            placeholder="Aircraft ID"
            className={styles.input}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.input}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Departed">Departed</option>
            <option value="Arrived">Arrived</option>
          </select>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Ticket Price"
            className={styles.input}
            required
          />

          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
