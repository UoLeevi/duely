import React from 'react';
import Link from 'components/Link';
import Theme from 'components/Theme';
import Chip from 'components/Chip';
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

const roleColors = {
  'client': 'secondary',
  'agent': 'accent',
  'manager': 'surface',
  'owner': 'success'
};

const BrandCard = ({ agency, className, ...props }) => {
  className = Array.from(new Set(((className ?? '') + ' brand-card').split(' '))).join(' ');
  console.log(agency);
  return (
    <Theme theme={ agency.theme }>
      <Link className={ className } { ...props } to={ createUrl(agency) }>
        <div className="logo"></div>
        <span className="name f-7 f-b white">{ agency.name }</span>
        <span className="domain f-4 f-b accent color-l2">{ agency.subdomain.name }.duely.app</span>
        <div className="roles grid row gap-2 mt-1">
          { agency.roles.map(role => <Chip key={ role } color={ roleColors[role] } >{ role }</Chip>) }
        </div>
      </Link>
    </Theme>
  );
};

export default BrandCard;
