import React from 'react';
import SplitLayout from 'components/SplitLayout';
import CreateBrandForm from 'components/CreateBrandForm';

const ProfileCreateBrand = React.forwardRef(({ ...props }, ref) => {
  return (
    <SplitLayout
      left={ <CreateBrandForm className="py-4" data-layout="center 5fr" /> }
      right={ <div className="background-bg bg-l3" data-layout="collapse-sm 4fr" ></div> }
      { ...props }
      ref={ ref }
    />
  );
});

export default ProfileCreateBrand;
