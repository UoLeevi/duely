import React, { useRef } from 'react';
import useBackgroundColor from 'hooks/useBackgroundColor';
import useAuthState from 'hooks/useAuthState';
import RestrictedArea from 'components/RestrictedArea';
import Route from 'components/Route';

const PortalRoot = React.forwardRef(({ ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;
  useBackgroundColor(ref, 'l5');
  const [state] = useAuthState();
  return (
    <RestrictedArea ref={ ref } restrict={ state.matches('visitor') } loading={ state.matches('updateAccessToken') } message="You need to first log in to access the portal." { ...props }>
      <Route />
    </RestrictedArea>
  );
});

export default PortalRoot;
