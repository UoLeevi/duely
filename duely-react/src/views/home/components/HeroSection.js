import React from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = () => {

  return (
    <section className="home-hero-section gutter">
      <div>
        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="100%"
          transition={{ delay: 0.4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <defs>
          <linearGradient id="hero-text-gradient">
            <stop offset="0" stopColor="#5A5AFF" />
            <stop offset="1" stopColor="#00BEA0" />
          </linearGradient>
          <mask id="hero-text-mask">
            <motion.circle cy="45" fill="#ffffff"
              transition={{ 
                delay: 4, 
                duration: 1.4,
                ease: "easeInOut"
              }}
              animate={{ 
                r: [0, 200, 200, 0],
                cx: [0, 0, 200, 200],
              }}
            />
          </mask>
          </defs>
          <text x="0" y="20" fontSize="20" fill="#000000">Platform for</text>
          <text x="0" y="45" fontSize="20" fontWeight="bold" fill="#000000">Digital Agencies</text>
          <text x="0" y="45" fontSize="20" fontWeight="bold" fill="url('#hero-text-gradient')" mask="url('#hero-text-mask')">Digital Agencies</text>
        </motion.svg>
      </div>
    </section>
  );
};

export default HeroSection;
