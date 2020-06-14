import React from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = () => {

  return (
    <section className="home-hero-section">
      <div>
        <motion.span
          className="f7"
          transition={{ delay: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >Platform for <span className="fb">Digital Agencies</span></motion.span>
      </div>
    </section>
  );
};

export default HeroSection;
