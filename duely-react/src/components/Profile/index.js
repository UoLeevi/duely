import React from 'react';
import { Outlet } from 'react-router-dom';
import RestrictedArea from 'components/RestrictedArea';
import useAuthState from 'hooks/useAuthState';

const Profile = ({ ...props }) => {
  const [state] = useAuthState();
  return (
    <RestrictedArea restrict={ state.matches('visitor') } loading={ state.matches('updateAccessToken') } message="You need to first log in to access your profile." { ...props }>
      <Outlet />
    </RestrictedArea>
  );
};

export default Profile;
