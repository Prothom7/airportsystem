import Header from '@/components/header';
import Footer from '@/components/footer';
import React from 'react';

export default function FlightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerHeight = 60; // adjust to your header height in px

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <main style={{ flex: 1, marginTop: headerHeight }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
