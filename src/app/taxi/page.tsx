"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";
import styles from "./taxi.module.css";

const TaxiMap = dynamic(() => import("@/components/TaxiMap"), { ssr: false });

const TaxiPage = () => {
  const [pickup, setPickup] = useState("Current Location");
  const [dropoff, setDropoff] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [price, setPrice] = useState("");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!pickupCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setPickupCoords([position.coords.latitude, position.coords.longitude]),
        () => setPickupCoords([20, 77])
      );
    }
  }, [pickupCoords]);

  useEffect(() => {
    if (dropoffCoords) {
      setDropoff(`Lat: ${dropoffCoords[0].toFixed(4)}, Lng: ${dropoffCoords[1].toFixed(4)}`);
    }
  }, [dropoffCoords]);

  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const toRad = (x: number) => (x * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(dropoffCoords[0] - pickupCoords[0]);
      const dLon = toRad(dropoffCoords[1] - pickupCoords[1]);
      const lat1 = toRad(pickupCoords[0]);
      const lat2 = toRad(dropoffCoords[0]);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      setPrice((distance * 10).toFixed(2));
    }
  }, [pickupCoords, dropoffCoords]);

  const handleBooking = async () => {
    if (!pickupCoords || !dropoffCoords || !pickupTime || !price) {
      setMessage("Please fill all fields and select locations on the map");
      setError(true);
      return;
    }

    const userId = "64f1a2b3c4d5e6f7890abcd1";

    try {
      const res = await fetch("/api/taxi/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, dropoff, pickupTime, price: Number(price), pickupCoords, dropoffCoords, userId }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setMessage("Server returned invalid JSON");
        setError(true);
        return;
      }

      if (data.success) {
        setMessage(`Booking successful! Distance: ${data.distance.toFixed(2)} km`);
        setError(false);
        setDropoff("");
        setPickupTime("");
        setPrice("");
        setDropoffCoords(null);
      } else {
        setMessage(data.error || "Booking failed");
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Booking failed due to server error");
      setError(true);
    }
  };

  return (
    <div className={styles.fullpage}>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.heading}>Book a Taxi</h2>

        <div>
          <label className={styles.sectionHeading}>Pickup Location</label>
          <input type="text" value={pickup} readOnly className={styles.containerInput} />
        </div>

        <div>
          <label className={styles.sectionHeading}>Dropoff Location</label>
          <input type="text" value={dropoff} readOnly className={styles.containerInput} />
        </div>

        <div>
          <label className={styles.sectionHeading}>Pickup Time</label>
          <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className={styles.containerInput} />
        </div>

        <div>
          <label className={styles.sectionHeading}>Price ($)</label>
          <input type="number" value={price} readOnly className={styles.containerInput} />
        </div>

        <div className={styles.mapContainer}>
          <TaxiMap
            pickupCoords={pickupCoords}
            dropoffCoords={dropoffCoords}
            setPickupCoords={setPickupCoords}
            setDropoffCoords={setDropoffCoords}
          />
        </div>

        <button onClick={handleBooking} className={styles.button}>Book Taxi</button>

        {message && <p className={`${styles.message} ${error ? styles.error : ""}`}>{message}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default TaxiPage;
