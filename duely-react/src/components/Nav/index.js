import React from 'react';
import { useLocation } from 'react-router-dom';
import NavButton from 'components/NavButton';
import NavTextButton from 'components/NavTextButton';
import './Nav.css';

const Nav = ({ items = [], layout: { orientation, section } = { orientation: 'vertical' } }) => {
  const { pathname } = useLocation();
  const submenu = items.find(item => pathname.startsWith(item?.link?.to));
  const submenuItems = submenu?.items?.map(({ link, text }) => {
    return (
      <NavTextButton tag="li" key={ link.to } text={ text } link={ link } />
    );
  });
  const expanded = (submenuItems?.length ?? 0) > 0;
  const menuItems = items.map(({ link, text, icon }) => {
    return (
      <NavButton tag="li" key={ link.to } text={ text } link={ link } icon={ icon } minimize={ expanded } />
    );
  });
  const sizeString = expanded && orientation === 'vertical' && 'w'.repeat(
    Math.max(...items
      .flatMap(item => item.items ?? [])
      .map(item => item.text.length)
    )
  );

  let className = 'nav';

  switch (orientation) {
    case 'horizontal':
      className += ' h';
      break;

    case 'vertical':
      className += ' v';
      break;

    default:
      break;
  }

  return (
    <nav className={ className } data-layout={ section } data-expanded={ expanded }>
      <div className="nav-menu">
        <ul>
          { menuItems }
        </ul>
      </div>
      <div className="nav-submenu">
        { expanded &&
          <div className="f-1 f-b surface color-s1n color-l2 ma-2">
            <span>{ submenu?.text }</span>
          </div>
        }
        <ul>
          { submenuItems }
          { sizeString && /* this is only for visual purposes */
            <li key="_sizeString" style={{ visibility: 'hidden' }} className="f-1 f-b pa-1">{ sizeString }</li>
          }
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
