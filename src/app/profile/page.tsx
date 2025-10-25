"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
}

interface Flight {
  _id: string;
  flightNumber: string;
  departureAirport: { name: string };
  arrivalAirport: { name: string };
  departureTime: string;
  arrivalTime: string;
  status: string;
  price: number;
}

interface Taxi {
  _id: string;
  user: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  price: number;
  status: string;
  paymentStatus: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentFlights, setCurrentFlights] = useState<Flight[]>([]);
  const [previousFlights, setPreviousFlights] = useState<Flight[]>([]);
  const [taxiOrders, setTaxiOrders] = useState<Taxi[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch user profile
        const res = await axios.get("/api/users/profile");
        const userData: User = res.data.user;

        if (!userData || !userData._id) {
          console.error("No user data found or missing _id");
          router.push("/login");
          return;
        }

        setUser(userData);
        const userId = userData._id.toString();

        // 2️⃣ Fetch flights
        const flightsRes = await axios.get("/api/users/flights");
        setCurrentFlights(flightsRes.data.current || []);
        setPreviousFlights(flightsRes.data.previous || []);

        // 3️⃣ Fetch taxi orders
        const taxisRes = await axios.get("/api/users/taxi");
        if (taxisRes.data && Array.isArray(taxisRes.data.all)) {
          // Filter taxi orders for the current user
          const userTaxis = taxisRes.data.all.filter((t: Taxi) => t.user === userId);
          setTaxiOrders(userTaxis);
        } else {
          setTaxiOrders([]);
        }

      } catch (err) {
        console.error("Error fetching profile:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const goToAdmin = () => {
    router.push("/admin/dashboard");
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loader}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <Header />
      <main className={styles.main}>
        {/* Personal Information */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Personal Information</h2>
          </div>
          {user ? (
            <div className={styles.userCard}>
              <div className={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
              <div className={styles.userDetails}>
                <h3>{user.username}</h3>
                <p>{user.email}</p>
                <div className={styles.badges}>
                  <span className={`${styles.badge} ${user.isVerified ? styles.verified : styles.unverified}`}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </span>
                  <span className={`${styles.badge} ${user.isAdmin ? styles.admin : styles.user}`}>
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </div>
              </div>
            </div>
          ) : <p>No user data found.</p>}
        </section>

        {/* Current Flights */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}><h2>Current Flights</h2></div>
          {currentFlights.length > 0 ? (
            <ul className={styles.flightList}>
              {currentFlights.map((flight, index) => (
                <li key={`${flight._id}-${index}`} className={styles.flightCard}>
                  <div className={styles.flightInfo}>
                    <h3>{flight.flightNumber}</h3>
                    <p>{flight.departureAirport.name} → {flight.arrivalAirport.name}</p>
                    <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
                    <span className={`${styles.status} ${styles[flight.status.toLowerCase()]}`}>
                      {flight.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className={styles.emptyText}>No current flights.</p>}
        </section>

        {/* Previous Flights */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}><h2>Previous Flights</h2></div>
          {previousFlights.length > 0 ? (
            <ul className={styles.flightList}>
              {previousFlights.map((flight, index) => (
                <li key={`${flight._id}-${index}`} className={styles.flightCard}>
                  <div className={styles.flightInfo}>
                    <h3>{flight.flightNumber}</h3>
                    <p>{flight.departureAirport.name} → {flight.arrivalAirport.name}</p>
                    <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
                    <span className={`${styles.status} ${styles[flight.status.toLowerCase()]}`}>
                      {flight.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className={styles.emptyText}>No previous flights.</p>}
        </section>

        {/* Taxi Orders */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}><h2>Taxi Orders</h2></div>
          {taxiOrders.length > 0 ? (
            <ul className={styles.flightList}>
              {taxiOrders.map((order, index) => (
                <li key={`${order._id}-${index}`} className={styles.flightCard}>
                  <div className={styles.flightInfo}>
                    <h3>{order.pickupLocation} → {order.dropoffLocation}</h3>
                    <p>Pickup: {new Date(order.pickupTime).toLocaleString()}</p>
                    <p>Price: ${order.price}</p>
                    <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                      {order.status}
                    </span>
                    <span className={`${styles.status} ${styles[order.paymentStatus.toLowerCase()]}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className={styles.emptyText}>No taxi orders found.</p>}
        </section>

        {/* Admin & Logout Buttons */}
        <div className={styles.logoutWrapper}>
          {user?.isAdmin && (
            <button onClick={goToAdmin} className={styles.adminBtn}>
              Admin Dashboard
            </button>
          )}
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
