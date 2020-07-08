import React from 'react';
import { useRoutes } from 'react-router-dom';
import './ResponsiveLayout.css';
import useBreakpoints from 'hooks/useBreakpoints';

const defaultComponents = {
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

  function routesFor(section) {
    const elements = new Map();
    return routes
      .map(({ [section]: component = defaultComponents[section], path, children }) => {

        let element = elements.get(component);

        if (element === undefined) {
          switch (typeof component) {
            case 'function':
              element = React.createElement(component, { layout: layoutPropFor(section) });
              break;

            case 'object': // elements are also accepted
              if (typeof component.type === 'function') {
                element = React.cloneElement(component, { layout: layoutPropFor(section) });
              } else {
                element = React.cloneElement(component, { 'data-layout': section });
              }
              
              break;

            case 'string':
              element = React.createElement(component, { 'data-layout': section });
              break;

            default:
              throw new Error('Invalid layout element.');
          }

          elements.set(component, element);
        }

        return { element, path, children };
      });
  }

  return (
    <div className="responsive-layout">
      { useRoutes(routesFor('topbar')) }
      { useRoutes(routesFor('nav')) }
      { useRoutes(routesFor('aside')) }
      <div className="body">
        { useRoutes(routesFor('header')) }
        { useRoutes(routesFor('main')) }
        { useRoutes(routesFor('footer')) }
      </div>
    </div>
  );
};

export default ResponsiveLayout;
