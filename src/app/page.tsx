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
    imgSrc: '/images/flight-information.jpg',
    imgAlt: 'Flight Information Board',
  },
  {
    title: 'Parking Solutions',
    description: 'Convenient parking options tailored to your travel needs.',
    imgSrc: '/images/parking-solutions.jpg',
    imgAlt: 'Parking Lot',
  },
];

const journeyCards = [
  {
    title: 'Plan your journey',
    description: 'Find transport links and road routes to and from anywhere in the UK.',
    link: '/journey-planner',
    imgSrc: '/images/journey-planner.jpg',
    imgAlt: 'Map and route planning',
  },
  {
    title: 'Transport options',
    description: 'Explore buses, trains, taxis, and more to get you to the airport.',
    link: '/transport-options',
    imgSrc: '/images/transport-options.jpg',
    imgAlt: 'Various transport modes',
  },
  {
    title: 'Road routes',
    description: 'Check the best road routes and traffic updates before you travel.',
    link: '/road-routes',
    imgSrc: '/images/road-routes.jpg',
    imgAlt: 'Road traffic and routes',
  },
];

const reviews = [
  {
    name: 'Alice Johnson',
    text: 'Excellent service, very smooth transfer experience!',
    imgSrc: '/images/reviewers/alice.jpg',
    imgAlt: 'Photo of Alice Johnson',
  },
  {
    name: 'Mark Lee',
    text: 'Up-to-date flight info kept me on track — highly recommend.',
    imgSrc: '/images/reviewers/mark.jpg',
    imgAlt: 'Photo of Mark Lee',
  },
  {
    name: 'Sophia Patel',
    text: 'The parking options are super convenient and affordable.',
    imgSrc: '/images/reviewers/sophia.jpg',
    imgAlt: 'Photo of Sophia Patel',
  },
];

const Home = () => (
  <div className={styles.page}>
    <Header />

    <main className={styles.mainContent}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Welcome to My Website</h1>
          <p>Your gateway to world-class services and experiences.</p>
          <button className={styles.ctaButton}>Explore Now</button>
        </div>
      </section>

      {/* Services Section */}
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

      {/* Journey Planner Section */}
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

      {/* Customer Reviews Section */}
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

      {/* Contact Us Section */}
      <section className={styles.contact}>
        <h2>Contact Us</h2>
        <p>Have questions? We’re here to help. Reach out to us anytime.</p>
        <a href="/contact" className={styles.ctaButton}>Get in Touch</a>
      </section>
    </main>

    <Footer />
  </div>
);

export default Home;
