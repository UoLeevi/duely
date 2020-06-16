import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import HeaderNav from './HeaderNav';
import DuelyLogo from '../../../components/DuelyLogo';

const Header = () => {

  return (
    <motion.header
      className="home-header"
      transition={{ delay: 1.2 }}
      initial={{ y: '-1rem', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="row center-v">
        <DuelyLogo />
        <h1 className="f5 fb pa-2">Duely</h1>
      </div>
      <HeaderNav />
    </motion.header>
  );
};

export default Header;
