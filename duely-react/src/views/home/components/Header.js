import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import HeaderNav from './HeaderNav';

const Header = () => {

  return (
    <motion.header
      className="home-header"
      transition={{ delay: 1.2 }}
      initial={{ y: '-1rem', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h1 className="f5 fb">Duely</h1>
      <HeaderNav />
    </motion.header>
  );
};

export default Header;
