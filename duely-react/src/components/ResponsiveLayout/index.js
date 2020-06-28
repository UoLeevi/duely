import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './ResponsiveLayout.css';

// routes

const ResponsiveLayout = ({ routes }) => {
  function contentFor(section) {
    const sectionRoutes = routes
      .filter(route => route[section] !== undefined)
      .map((route, index) => {
        const Component = route[section];

        return (
          <Route
            key={ index }
            path={ route.path }
            exact={ route.exact }
            children={ <Component /> }
          />
        );
      });

    return (
      <Switch>
        { sectionRoutes }
      </Switch>
    );
  }

  const headerContent = contentFor('header');
  const navContent = contentFor('nav');
  const mainContent = contentFor('main');
  const asideContent = contentFor('aside');
  const footerContent = contentFor('footer');

  return (
    <div className="responsive-layout">
      <header>{ headerContent }</header>
      <div className="body">
        <nav>{ navContent }</nav>
        <main>{ mainContent }</main>
        <aside>{ asideContent }</aside>
      </div>
      <footer>{ footerContent }</footer>
    </div>
  );
};

export default ResponsiveLayout;
