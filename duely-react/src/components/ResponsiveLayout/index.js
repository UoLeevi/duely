import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './ResponsiveLayout.css';
import useBreakpoints from 'hooks/useBreakpoints';

const defaultElements = {
  'topbar': 'header',
  'nav': 'nav',
  'aside': 'aside',
  'header': 'header',
  'main': 'main',
  'footer': 'footer'
};

const ResponsiveLayout = ({ routes }) => {
  const { md } = useBreakpoints();

  function layoutPropFor(section) {
    const layout = {
      section
    };

    if (section === 'nav') {
      layout.orientation = md ? 'vertical' : 'horizontal';
    }

    return layout;
  }

  function contentFor(section) {
    const sectionRoutes = routes
      .map((route, index) => {

        const content = route[section] || defaultElements[section];
        let LayoutElement;

        switch (typeof content) {
          case 'function':
            LayoutElement = content;
            return (
              <Route key={ index } path={ route.path } exact={ route.exact }>
                <LayoutElement layout={ layoutPropFor(section) } />
              </Route>
            );

          case 'object':
            if (typeof content.type === 'function') {
              LayoutElement = () => React.cloneElement(content, { layout: layoutPropFor(section) });
            } else {
              LayoutElement = () => React.cloneElement(content, { 'data-layout': section });
            }
            
            return (
              <Route key={ index } path={ route.path } exact={ route.exact }>
                <LayoutElement />
              </Route>
            );

          case 'string':
            LayoutElement = content;
            return (
              <Route key={ index } path={ route.path } exact={ route.exact }>
                <LayoutElement data-layout={ section } />
              </Route>
            );

          default:
            throw new Error('Invalid layout element.');
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
