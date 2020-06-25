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
          <text x="0" y="0" fontSize="20">
            <tspan x="0" dy="20" className="color-grey-2">Platform for</tspan>
            <tspan x="0" dy="25" className="color-black" fontWeight="bold">Digital Agencies</tspan>
            <tspan x="0" dy="0" fontWeight="bold" fill="url('#hero-text-gradient')" mask="url('#hero-text-mask')">Digital Agencies</tspan>
          </text>
        </motion.svg>
      </div>
    </section>
  );
};

export default HeroSection;
