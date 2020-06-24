import React, { useContext } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';
import { DomainContext } from './contexts/DomainContext';
import AgencyHome from './views/agency-home';
import Dashboard from './views/Dashboard';
import Home from './views/home';
import Portal from './views/Portal';
import Profile from './views/Profile';

const DomainSwitch = () => {
  const { subdomain } = useContext(DomainContext);
  const location = useLocation();

  if (subdomain === null) {
    return (
      <AnimatePresence exitBeforeEnter>
        <Switch location={ location } key={ location.key }>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <Switch location={ location } key={ location.key }>
        <Route path="/portal">
          <Portal />
        </Route>
        <Route path="/">
          <AgencyHome />
        </Route>
      </Switch>
    </AnimatePresence>
  );
};

export default DomainSwitch;
