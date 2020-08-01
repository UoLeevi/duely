import React from 'react';
import useAuthState from 'hooks/useAuthState';
import ResponsiveLayout from 'components/ResponsiveLayout';
import RestrictedArea from 'components/RestrictedArea';
import Route from 'components/Route';
import Link from 'components/Link';
import Topbar from 'components/Topbar';
import DuelyLogo from 'components/DuelyLogo';

const ProfileRoot = ({ ...props }) => {
  const [state] = useAuthState();
  return (
    <ResponsiveLayout
      topbar={
        <Topbar className="pa-4" data-layout="floating">
        <Link className="flex row center-v" to="/">
          <DuelyLogo color="surface-l3" stroke="var(--color-surface-l3)" />
          <h1 className="f-5 f-b pa-2 surface color-l3">Duely</h1>
        </Link>
        </Topbar>
      }
      main={
        <RestrictedArea restrict={ state.matches('visitor') } loading={ state.matches('updateAccessToken') } message="You need to first log in to access your profile." { ...props }>
          <Route />
        </RestrictedArea>
      }
    />
  );
};

export default ProfileRoot;
