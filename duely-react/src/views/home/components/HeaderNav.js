import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const getInitialState = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    isOpen: queryParams.has('login')
  };
};

const initialState = getInitialState();

const HeaderNav = () => {
  const { loading, isLoggedIn, user, logOut } = useContext(AuthContext);
  const [isOpen, toggleIsOpen] = useState(initialState.isOpen);

  return (
    <AnimatePresence>
      { loading ? null : (
        isOpen ? null : (
          <motion.div
            initial={{ y: '-1rem', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            { isLoggedIn ? <button onClick={ logOut }>Log out</button> : <button onClick={ toggleIsOpen }>Log in</button> }
          </motion.div>
        )
      ) }
    </AnimatePresence>
  );
};

export default HeaderNav;
