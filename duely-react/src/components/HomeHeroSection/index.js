import React from 'react';
import { motion } from 'framer-motion';
import './HomeHeroSection.css';

const HomeHeroSection = ({ ...props }) => {
  return (
    <section className="home-hero-section g-2" { ...props }>
      <div>
        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="100%"
          transition={{ delay: 0.4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <defs>
          <linearGradient id="hero-text-gradient">
            <stop offset="0" stopColor="#5A5AFF" />
            <stop offset="1" stopColor="#00BEA0" />
          </linearGradient>
          </defs>
          <text x="0" y="0" fontSize="20">
            <tspan x="0" dy="20">Platform for</tspan>
            <tspan x="0" dy="25" fontWeight="bold" fill="url('#hero-text-gradient')">Digital Agencies</tspan>
          </text>
          <text x="0" y="55" fontSize="8" fill="var(--color-background-l2n)">
            <tspan x="0" dy="10">Duely provides an easy way to market,</tspan>
            <tspan x="0" dy="13">sell and deliver services online.</tspan>
          </text>
        </motion.svg>
      </div>
    </section>
  );
};

export default HomeHeroSection;
