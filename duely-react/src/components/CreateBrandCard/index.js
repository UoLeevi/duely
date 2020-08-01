import React from 'react';
import Link from 'components/Link';
import Button from 'components/Button';
import './CreateBrandCard.css';


const CreateBrandCard = ({ className, ...props }) => {
  className = Array.from(new Set(((className ?? '') + ' create-brand-card').split(' '))).join(' ');

  return (
    <Link className={ className } { ...props } to={ '/profile/create-brand' }>
      <Button className="f-6" text color="primary">Create brand</Button>
    </Link>
  );
};

export default CreateBrandCard;
