import React from 'react';
import Link from 'components/Link';
import './BrandCard.css';

function createUrl(agency) {
  if (!agency.roles)
    return `?subdomain=${agency.subdomain.name}`;

  if (agency.roles.includes('agent'))
    return `/dashboard?subdomain=${agency.subdomain.name}`;

  if (agency.roles.includes('client'))
    return `/portal?subdomain=${agency.subdomain.name}`;

  throw new Error("Unexpected 'roles' value");
}

const BrandCard = ({ agency, className, ...props }) => {
  className = Array.from(new Set(((className ?? '') + ' brand-card').split(' '))).join(' ');
  console.log(agency);
  return (
    <Link className={ className } { ...props } to={ createUrl(agency) }>
      <img className="logo" alt="logo" src={ agency.theme.imageLogo.data } />
      <span className="name f-5 f-b">{ agency.name }</span>
      <span className="domain f-3 f-b surface color-l2">{ agency.subdomain.name }.duely.app</span>
      <span className="roles f-2 f-b">{ agency.roles.join(' ') }</span>
    </Link>
  );
};

export default BrandCard;
