import React from 'react';
import useAppState from 'hooks/useAppState';
import { matchPath } from 'routes';
import NavButton from 'components/NavButton';
import NavTextButton from 'components/NavTextButton';
import AnimatedTransition from 'components/AnimatedTransition';
import './Nav.css';

const SubmenuList = ({ submenu, sizeString, ...props }) => {
  const submenuItems = submenu?.items?.map(({ link, text }) => {
    return (
      <NavTextButton tag="li" key={ link.to } text={ text } link={ link } />
    );
  });

  return (
    <AnimatedTransition shouldTransition={ (prevProps, props) => prevProps && prevProps.submenu?.text !== props.submenu?.text }>
      <ul { ...props }>
        { sizeString && <li data-sizer className="f-1 f-b pa-1">{ sizeString }</li> }
        { submenu && <NavTextButton tag="li" className="nav-submenu-title f-1 f-b surface color-s1n color-l2" text={ submenu?.text } link={ submenu?.link && { ...submenu.link, end: true } } /> }
        { submenuItems }
        { sizeString && <li data-sizer className="f-1 f-b pa-1">{ sizeString }</li> }
      </ul>
    </AnimatedTransition>
  );
};

const Nav = React.forwardRef(({ items = [], 'data-layout': layout, ...props }, ref) => {
  const [state, ] = useAppState();
  const { pathname } = state.context.history.location;
  const submenu = items.find(({ link: { to: path, end } = {} }) => matchPath({ path, end }, pathname) !== null);
  const expanded = (submenu?.items?.length ?? 0) > 0;
  const menuItems = items.map(({ link, text, icon }) => {
    return (
      <NavButton tag="li" key={ link.to } text={ text } link={ link } icon={ icon } minimize={ expanded } />
    );
  });

  const orientation = /\sorientation:(\S*)/.exec(layout)?.[1] ?? 'vertical';
  const sizeString = orientation === 'vertical' && 'w'.repeat(
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
    <nav className={ className } data-layout={ layout } data-expanded={ expanded } { ...props } ref={ ref }>
      <div className="nav-menu">
        <ul>
          { menuItems }
        </ul>
      </div>
      <div className="nav-submenu" tag="div">
        <SubmenuList submenu={ submenu } sizeString={ sizeString } />
      </div>
    </nav>
  );
});

export default Nav;
