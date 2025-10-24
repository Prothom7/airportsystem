"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import styles from "./contacts.module.css";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <div className={styles.main}>
          {/* Contact Form */}
          <div className={styles.sectionHeader}>
            <h2>Contact Us</h2>
          </div>

          <div className={styles.userCard}>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p
                  className={`${styles.statusMessage} ${
                    status === "success" ? styles.success : styles.error
                  }`}
                >
                  {status === "success"
                    ? "Your message was sent successfully!"
                    : "Something went wrong. Please try again."}
                </p>
              )}
            </form>
          </div>

          {/* About Us Section */}
          <div className={styles.aboutSection}>
            <h2 className={styles.aboutHeader}>About Us</h2>
            <div className={styles.staffCards}>
              {/* Airport Director */}
              <div className={styles.staffCard}>
                <img src="/images/director.jpg" alt="Airport Director" />
                <h3>Jane Smith</h3>
                <p>Airport Director</p>
                <p>
                  Jane oversees airport operations ensuring safety, compliance, and smooth operations.
                </p>
              </div>

              {/* Air Traffic Controller */}
              <div className={styles.staffCard}>
                <img src="/images/atc.jpg" alt="Air Traffic Controller" />
                <h3>John Doe</h3>
                <p>Air Traffic Controller</p>
                <p>
                  John manages the airspace ensuring safe takeoffs, landings, and air traffic flow.
                </p>
              </div>

              {/* Operations Manager */}
              <div className={styles.staffCard}>
                <img src="/images/ops-manager.jpg" alt="Operations Manager" />
                <h3>Mary Johnson</h3>
                <p>Operations Manager</p>
                <p>
                  Mary coordinates all airport logistics including staffing, scheduling, and resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
