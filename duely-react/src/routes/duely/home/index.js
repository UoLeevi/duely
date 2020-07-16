import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Topbar from 'components/Topbar';
import TopbarActions from 'components/TopbarActions';
import DuelyLogo from 'components/DuelyLogo';
import HomeHeroSection from 'components/HomeHeroSection';
import HomeFeaturesSection from 'components/HomeFeaturesSection';
import HeaderWithActions from 'components/HeaderWithActions'

export default [
  {
    path: '/',
    element: (
      <ResponsiveLayout
        topbar={
          <Topbar className="gutter py-4">
            <div className="row center-v">
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
    path: '/create-account',
    element: (
      <ResponsiveLayout
        topbar={
          <Topbar className="gutter py-4">
            <Link className="row center-v" to="/">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </Link>
            <TopbarActions links={[
              { to: '/', text: 'Home' }
            ]} />
          </Topbar>
        }
        header={ <HeaderWithActions title="Sign up" subtitle="Create a new account for duely.app" /> }
      />
    )
  }
];