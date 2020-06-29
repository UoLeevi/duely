import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './ResponsiveLayout.css';

// routes


const elements = {
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
        const Element = elements[section];

        if (route[section] === undefined) {
          return (
            <Route
              key={ index }
              path={ route.path }
              exact={ route.exact }
              children={ <Element /> }
            />
          );
        }

        if (typeof route[section] === 'function') {
          const Content = route[section];
          return (
            <Route
              key={ index }
              path={ route.path }
              exact={ route.exact }
              children={ 
                <Element>
                  <Content />
               </Element>
              }
            />
          );
        } else {
          const { props, component: Content } = route[section];
          return (
            <Route
              key={ index }
              path={ route.path }
              exact={ route.exact }
              children={ 
                <Element { ...props }>
                  <Content />
               </Element>
              }
            />
          );
        }
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
