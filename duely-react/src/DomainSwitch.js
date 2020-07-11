import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';
import { DomainContext } from './contexts/DomainContext';
import AgencyHome from './views/agency-home';
import Dashboard from './views/dashboard';
import Home from './views/home';
import Portal from './views/portal';
import Profile from './views/profile';

const DomainSwitch = () => {
  const { subdomain } = useContext(DomainContext);
  const location = useLocation();

  if (subdomain === null) {
    return (
      <AnimatePresence exitBeforeEnter>
        <Routes location={ location } key={ location.key }>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={ location } key={ location.key }>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/portal">
          <Portal />
        </Route>
        <Route path="/">
          <AgencyHome />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default DomainSwitch;
