import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { useModal } from '../../../hooks';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../../../components/LogInForm';

const getInitialState = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    showLogIn: queryParams.has('login')
  };
};

const initialState = getInitialState();

const HeaderNav = () => {
  const { push } = useHistory(); // TODO: add & remove ?login query parameter when login form is shown (should maybe go in LoginForm)
  const { loading, isLoggedIn, logOut } = useContext(AuthContext);
  const [showModal] = useModal(({ hideModal }) => <LoginForm whenDone={ () => { hideModal(); push('/profile'); } } />, { options: { show: !isLoggedIn && initialState.showLogIn }});

  return (
    <AnimatePresence exitBeforeEnter>
      { !loading && (
        <motion.div
          initial={{ y: '-1rem', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          { isLoggedIn 
            ? <button key="log-out" className="default" onClick={ logOut }>Log out</button> 
            : <button key="log-in" className="default" onClick={ showModal }>Log in</button>
          }
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderNav;
