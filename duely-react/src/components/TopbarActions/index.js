import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import LoginForm from 'components/LogInForm';
import AnimatedTransition from 'components/AnimatedTransition';

const getInitialState = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    showLogIn: queryParams.has('login')
  };
};

const initialState = getInitialState();

const TopbarActions = ({ ...props }) => {
  const navigate = useNavigate(); // TODO: add & remove ?login query parameter when login form is shown (should maybe go in LoginForm)
  const { loading, isLoggedIn, logOut } = useAuth();
  const [showModal] = useModal(({ hideModal }) => <LoginForm whenDone={ () => { hideModal(); navigate('/profile'); } } />, { options: { show: !isLoggedIn && initialState.showLogIn }});

  return (
    <AnimatedTransition>
      { loading
        ? null
        : isLoggedIn 
          ? <button className="default dense" onClick={ logOut }>Log out</button> 
          : <button className="default" onClick={ showModal }>Log in</button>
      }
    </AnimatedTransition>
    // <AnimatePresence exitBeforeEnter>
    //   { !loading && (
    //     <motion.div
    //       initial={{ y: '-1rem', opacity: 0 }}
    //       animate={{ y: 0, opacity: 1 }}
    //       exit={{ opacity: 0 }}
    //       { ...props }
    //     >
    //       { isLoggedIn 
    //         ? <button key="log-out" className="default dense" onClick={ logOut }>Log out</button> 
    //         : <button key="log-in" className="default" onClick={ showModal }>Log in</button>
    //       }
    //     </motion.div>
    //   )}
    // </AnimatePresence>
  );
};

export default TopbarActions;
