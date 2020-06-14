import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom'
import { DomainContext } from './contexts/DomainContext';
import AgencyHome from './views/AgencyHome';
import Dashboard from './views/Dashboard';
import Home from './views/home/Home';
import Portal from './views/Portal';
import Profile from './views/Profile';

const DomainSwitch = () => {
  const { subdomain } = useContext(DomainContext);

  if (subdomain === null) {
    return (
      <Switch>
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
    );
  }

  return (
    <Switch>
      <Route path="/portal">
        <Portal />
      </Route>
      <Route path="/">
        <AgencyHome />
      </Route>
    </Switch>
  );
};

export default DomainSwitch;
