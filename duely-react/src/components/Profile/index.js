import React from 'react';
import useAuthState from 'hooks/useAuthState';
import RestrictedArea from 'components/RestrictedArea';
import Route from 'components/Route';

const Profile = ({ ...props }) => {
  const [state] = useAuthState();
  return (
    <RestrictedArea restrict={ state.matches('visitor') } loading={ state.matches('updateAccessToken') } message="You need to first log in to access your profile." { ...props }>
      <Route />
    </RestrictedArea>
  );
};

export default Profile;
