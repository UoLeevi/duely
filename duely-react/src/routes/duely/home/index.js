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
          <Topbar className="gutter py-4" data-layout="floating">
            <div className="flex row center-v">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </div>
            <TopbarActions links={[
              { to: '/profile', text: 'Profile' }
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
          <Topbar className="gutter py-4" data-layout="floating">
            <Link className="flex row center-v" to="/">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </Link>
            <TopbarActions links={[
              { to: '/', text: 'Home' }
            ]} />
          </Topbar>
        }
        main={
          <SplitLayout
            left={ <LogInForm className="gutter" data-layout="center 5fr" /> }
            right={ <div className="background-bg bg-l3" data-layout="collapse-sm 4fr" ></div> }
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
          <Topbar className="gutter py-4" data-layout="floating">
            <Link className="flex row center-v" to="/">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </Link>
            <TopbarActions links={[
              { to: '/', text: 'Home' }
            ]} />
          </Topbar>
        }
        main={
          <SplitLayout
            left={ <SignUpForm className="gutter" data-layout="center 5fr" /> }
            right={ <div className="background-bg bg-l3" data-layout="collapse-sm 4fr" ></div> }
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
          <Topbar className="gutter py-4">
            <Link className="flex row center-v" to="/">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </Link>
            <TopbarActions links={[
              { to: '/', text: 'Home' }
            ]} />
          </Topbar>
        }
        header={ <HeaderWithActions title="Set a new password" /> }
      />
    )
  }
];
