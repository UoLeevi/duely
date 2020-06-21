import React from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = () => {

  return (
    <section className="home-hero-section gutter">
      <div>
        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="100%"
          transition={{ delay: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <defs>
            <motion.radialGradient id="hero-text-gradient" gradientUnits="userSpaceOnUse" r="160%"
              transition={{ duration: 8, delay: 2, loop: Infinity }}
              animate={{
                cx: ['0%', '15%', '10%', '30%', '50%', '70%', '80%', '100%'],
                cy: ['0%', '40%', '60%', '50%', '30%', '50%', '70%', '100%']
              }}
            >
              <motion.stop offset="20%"
                transition={{ duration: 8, delay: 2, loop: Infinity }}
                animate={{ stopColor: ['#000000', '#000000', '#d7d2cc', '#d7d2cc', '#d6ae7b', '#eacda3', '#304352', '#000000'] }}
              />
              <motion.stop offset="40%"
                transition={{ duration: 8, delay: 2, loop: Infinity }}
                animate={{ stopColor: ['#000000', '#000000', '#304352', '#2980b9', '#eacda3', '#d6ae7b', '#304352', '#000000'] }}
              /> 
              <motion.stop offset="60%"
                transition={{ duration: 8, delay: 2, loop: Infinity }}
                animate={{ stopColor: ['#000000', '#000000', '#304352', '#283E51', '#CCCCB2', '#d7d2cc', '#d7d2cc', '#000000'] }}
              /> 
            </motion.radialGradient>
          </defs>
          <text x="0" y="20" fontSize="20" fill="#000000">Platform for</text>
          <text x="0" y="45" fontSize="20" fontWeight="bold" fill="url('#hero-text-gradient')">Digital Agencies</text>
        </motion.svg>
      </div>
    </section>
  );
};

export default HeroSection;
