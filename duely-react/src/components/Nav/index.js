import React from 'react';
import { useLocation } from 'react-router-dom';
import NavButton from 'components/NavButton';
import NavTextButton from 'components/NavTextButton';
import TransitionElement from 'components/TransitionElement';
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
  const sizeString = 'w'.repeat(
    Math.max(
      ...items
        .flatMap(item => item.items ?? [])
        .map(item => item.text.length),
      ...items
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
      <TransitionElement className="nav-submenu" tag="div" compare={ submenu?.text }>
        <div className="f-1 f-b surface color-s1n color-l2 ma-2">
          <span>{ expanded && submenu?.text }</span>
        </div>
        <ul>
          { submenuItems }
        </ul>
      </TransitionElement>
      <div className="nav-submenu sizer">
        <div style={{ visibility: 'hidden' }} className="f-1 f-b surface color-s1n color-l2 ma-2">
          <span>{ sizeString }</span>
        </div>
        <ul>
          <li style={{ visibility: 'hidden' }} className="f-1 f-b pa-1">{ sizeString }</li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
