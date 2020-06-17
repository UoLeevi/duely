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
  const { push, location } = useHistory(); // TODO: add & remove ?login query parameter when login form is shown (should baybe go in LoginForm)
  const { loading, isLoggedIn, logOut } = useContext(AuthContext);
  const [showModal] = useModal(({ hideModal }) => <LoginForm key="login-form" whenDone={ hideModal } />, { options: { show: !isLoggedIn && initialState.showLogIn }});

  return (
    <AnimatePresence>
      { !loading && (
        <motion.div
          initial={{ y: '-1rem', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          { isLoggedIn 
            ? <button className="default" onClick={ logOut }>Log out</button> 
            : <button className="default" onClick={ showModal }>Log in</button>
          }
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderNav;
