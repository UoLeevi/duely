import React from 'react';
import Link from 'components/Link';
import ResponsiveLayout from 'components/ResponsiveLayout';
import SplitLayout from 'components/SplitLayout';
import Topbar from 'components/Topbar';
import TopbarActions from 'components/TopbarActions';
import DuelyLogo from 'components/DuelyLogo';
import HomeHeroSection from 'components/HomeHeroSection';
import HomeFeaturesSection from 'components/HomeFeaturesSection';
import HeaderWithActions from 'components/HeaderWithActions';
import SignUpForm from 'components/SignUpForm';
import LogInForm from 'components/LogInForm';

export default [
  {
    path: '/',
    element: (
      <ResponsiveLayout
        topbar={
          <Topbar className="g-2 py-4" data-layout="floating">
            <div className="flex row center-v">
              <DuelyLogo animate />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </div>
            <TopbarActions links={[
              { to: '/profile', text: 'Profile', color: 'primary' }
            ]} />
          </Topbar>
        }
        main={
          <div style={{ position: 'relative' }}>
            <HomeHeroSection />
            <HomeFeaturesSection />
          </div>
        }
      />
    )
  },
  {
    path: 'log-in',
    element: (
      <ResponsiveLayout
        topbar={
          <Topbar className="g-2 py-4" data-layout="floating">
            <Link className="flex row center-v" to="/">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </Link>
          </Topbar>
        }
        main={
          <SplitLayout
            left={ <LogInForm className="g-2 pt-topbar" data-layout="center 5fr" /> }
            right={ <div data-layout="collapse-md 4fr" data-bg="l3n" ></div> }
          />
        }
      />
    )
  },
  {
    path: 'sign-up',
    element: (
      <ResponsiveLayout
        topbar={
          <Topbar className="g-2 py-4" data-layout="floating">
            <Link className="flex row center-v" to="/">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </Link>
          </Topbar>
        }
        main={
          <SplitLayout
            left={ <SignUpForm className="g-2 pt-topbar" data-layout="center 5fr" /> }
            right={ <div data-layout="collapse-md 4fr" data-bg="l3n" ></div> }
          />
        }
      />
    )
  },
  {
    path: 'new-password',
    element: (
      <ResponsiveLayout
        topbar={
          <Topbar className="g-2 py-4">
            <Link className="flex row center-v" to="/">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </Link>
          </Topbar>
        }
        header={ <HeaderWithActions title="Set a new password" /> }
      />
    )
  }
];
