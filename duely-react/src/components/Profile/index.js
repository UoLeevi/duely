import React from 'react';
import { Outlet } from 'react-router-dom';
import RestrictedArea from 'components/RestrictedArea';
import useAuth from 'hooks/useAuth';

const Profile = ({ ...props }) => {
  const { isLoggedIn, loading } = useAuth();
  return (
    <RestrictedArea restrict={ !isLoggedIn } loading={ loading } message="You need to first log in to access your profile." { ...props }>
      <Outlet />
    </RestrictedArea>
  );
};

export default Profile;
