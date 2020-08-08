import React from 'react';
import Link from 'components/Link';
import Button from 'components/Button';
import { createClassName } from 'utils';
import './CreateBrandCard.css';


const CreateBrandCard = ({ className, ...props }) => {
  className = createClassName(className, 'create-brand-card');

  return (
    <Link className={ className } { ...props } to={ '/profile/create-brand' }>
      <Button className="f-6" text color="primary">Create brand</Button>
    </Link>
  );
};

export default CreateBrandCard;
