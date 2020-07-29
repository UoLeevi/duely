import React from 'react';
import useRoute from 'hooks/useRoute';

const BrandCardList = ({ ...props }) => {
  const { data } = useRoute();

  console.log(data);

  return (
    <div { ...props }>
      
    </div>
  );
};

export default BrandCardList;
