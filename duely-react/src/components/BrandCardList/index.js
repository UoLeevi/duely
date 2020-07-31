import React from 'react';
import { useQuery } from '@apollo/client';
import queries from 'apollo/queries';
import BrandCard from 'components/BrandCard';
import './BrandCardList.css';

const BrandCardList = ({ className, ...props }) => {
  const agenciesQuery = useQuery(queries.agencies.query);
  const invitesQuery = useQuery(queries.invites.query);
  const agencies = queries.agencies.result(agenciesQuery.data);
  const invites = queries.invites.result(invitesQuery.data);
  console.log(agencies, invites);

  className = Array.from(new Set(((className ?? '') + ' brand-card-list grid row').split(' '))).join(' ');

  return (
    <div className={ className } { ...props }>
      { agencies?.map(agency => (
        <BrandCard key={ agency.uuid } agency={ agency } />
      ))}
    </div>
  );
};

export default BrandCardList;
