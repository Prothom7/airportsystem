import React from 'react';
import styles from './footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} AirportName. All rights reserved.</p>
      <p>Contact us: info@airportname.com | +1 (123) 456-7890</p>
    </footer>
  );
};

export default Footer;
