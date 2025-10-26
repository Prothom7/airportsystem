import Header from '../components/header';
import Footer from '../components/footer';
import styles from './home.module.css';

const services = [
  {
    title: 'Airport Transfers',
    description: 'Seamless and comfortable transfer options to and from the airport.',
    imgSrc: '/image/signup_background.png',
    imgAlt: 'Airport Transfer Vehicle',
  },
  {
    title: 'Flight Information',
    description: 'Real-time updates and notifications for your flights.',
    imgSrc: '/image/flights.jpg',
    imgAlt: 'Flight Information Board',
  },
  {
    title: 'Parking Solutions',
    description: 'Convenient parking options tailored to your travel needs.',
    imgSrc: '/image/parking.jpeg',
    imgAlt: 'Parking Lot',
  },
];

const journeyCards = [
  {
    title: 'Plan your journey',
    description: 'Find transport links and road routes to and from anywhere in the UK.',
    link: '/journey-planner',
    imgSrc: '/image/journey.png',
    imgAlt: 'Map and route planning',
  },
  {
    title: 'Transport options',
    description: 'Explore buses, trains, taxis, and more to get you to the airport.',
    link: '/transport-options',
    imgSrc: '/image/taxi.jpg',
    imgAlt: 'Various transport modes',
  },
  {
    title: 'Road routes',
    description: 'Check the best road routes and traffic updates before you travel.',
    link: '/road-routes',
    imgSrc: '/image/road.jpg',
    imgAlt: 'Road traffic and routes',
  },
];

const reviews = [
  {
    name: 'Megha Tania',
    text: 'Excellent service, very smooth transfer experience!',
    imgSrc: '/image/megha.jpeg',
    imgAlt: 'Photo of Megha Tania',
  },
  {
    name: 'Maruf Shafiq',
    text: 'Up-to-date flight info kept me on track — highly recommend.',
    imgSrc: '/image/maruf.jpeg',
    imgAlt: 'Photo of Maruf Shafiq',
  },
  {
    name: 'Antu Chakma',
    text: 'The parking options are super convenient and affordable.',
    imgSrc: '/image/antu.jpeg',
    imgAlt: 'Photo of Antu Chakma',
  },
];

const Home = () => (
  <div className={styles.page}>
    <Header />

    <main className={styles.mainContent}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Welcome to Kuet Airport</h1>
          <p>Your gateway to world-class services and experiences.</p>
        </div>
      </section>

      <section className={styles.services}>
        <h2>Our Services</h2>
        <div className={styles.serviceList}>
          {services.map(({ title, description, imgSrc, imgAlt }, idx) => (
            <article key={idx} className={styles.serviceItem}>
              <img src={imgSrc} alt={imgAlt} className={styles.cardImage} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.journeyPlanner}>
        <h2>Journey planner</h2>
        <div className={styles.cardList}>
          {journeyCards.map(({ title, description, link, imgSrc, imgAlt }, idx) => (
            <article key={idx} className={styles.card}>
              <img src={imgSrc} alt={imgAlt} className={styles.cardImage} />
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
              <a href={link} className={styles.cardLink}>Learn more</a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.reviews}>
        <h2>What Our Customers Say</h2>
        <div className={styles.reviewList}>
          {reviews.map(({ name, text, imgSrc, imgAlt }, idx) => (
            <blockquote key={idx} className={styles.reviewItem}>
              <img src={imgSrc} alt={imgAlt} className={styles.reviewImage} />
              <p>"{text}"</p>
              <footer>- {name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className={styles.contact}>
        <h2>Contact Us</h2>
        <p>Have questions? We’re here to help. Reach out to us anytime.</p>
        <a href="/contacts" className={styles.ctaButton}>Get in Touch</a>
      </section>
    </main>

    <Footer />
  </div>
);

export default Home;
