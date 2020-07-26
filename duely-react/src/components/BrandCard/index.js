import React from 'react';
import './BrandCard.css';

const BrandCard = ({ agencyUuid, className, ...props }) => {
  className = Array.from(new Set(((className ?? '') + ' brand-card grid column').split(' '))).join(' ');
  return (
    <div className={ className } { ...props }>
      picture
      agency name
      domain
      roles
    </div>
  );
};

export default BrandCard;
