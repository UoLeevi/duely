import React from 'react';
import FocusedLayout from 'components/FocusedLayout';
import BrandCardList from 'components/BrandCardList';
import NavButton from 'components/NavButton';
import { BsGear } from 'react-icons/bs';

const ProfileSelectBrand = React.forwardRef(({ ...props }, ref) => {
  return (
    <FocusedLayout
      header={ <span className="f-7 f-b">Select a brand</span> }
      main={ <BrandCardList /> }
      actions={<NavButton link={{ to: '/profile/settings' }} icon={BsGear} />}
      { ...props }
      ref={ ref }
    />
  );
});

export default ProfileSelectBrand;
