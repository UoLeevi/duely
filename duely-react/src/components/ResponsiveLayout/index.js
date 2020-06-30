import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './ResponsiveLayout.css';

// routes


const defaultElements = {
  'topbar': 'header',
  'nav': 'nav',
  'aside': 'aside',
  'header': 'header',
  'main': 'main',
  'footer': 'footer'
};

const ResponsiveLayout = ({ routes }) => {
  function contentFor(section) {
    const sectionRoutes = routes
      .map((route, index) => {
        
        const Element = route[section] || defaultElements[section];
        const LayoutElement = () => React.cloneElement(<Element/>, { 'data-layout': section });

        return (
          <Route key={ index } path={ route.path } exact={ route.exact }>
            <LayoutElement />
          </Route>
        );
      });

    return () => (
      <Switch>
        { sectionRoutes }
      </Switch>
    );
  }

  const Topbar = contentFor('topbar');
  const Nav = contentFor('nav');
  const Aside = contentFor('aside');
  const Header= contentFor('header');
  const Main = contentFor('main');
  const Footer = contentFor('footer');

  return (
    <div className="responsive-layout">
      <Topbar />
      <Nav />
      <Aside />
      <div className="body">
        <Header />
        <Main />
        <Footer />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
