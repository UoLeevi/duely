import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useModal } from '../../../hooks';
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
  const [showModal] = useModal(({ hideModal }) => (<button key="1" onClick={ hideModal }>test</button>));

  return (
    <AnimatePresence>
      { !loading && (
        <motion.div
          initial={{ y: '-1rem', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          { isLoggedIn ? <button onClick={ logOut }>Log out</button> : <button onClick={ showModal }>Log in</button> }
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderNav;
