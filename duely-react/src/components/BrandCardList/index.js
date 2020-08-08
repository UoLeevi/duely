import React from 'react';
import { useQuery } from '@apollo/client';
import queries from 'apollo/queries';
import { createClassName } from 'utils';
import BrandCard from 'components/BrandCard';
import CreateBrandCard from 'components/CreateBrandCard';
import './BrandCardList.css';

const BrandCardList = ({ className, ...props }) => {
  const agenciesQuery = useQuery(queries.agencies.query);
  // const invitesQuery = useQuery(queries.invites.query);
  const agencies = queries.agencies.result(agenciesQuery.data);
  // const invites = queries.invites.result(invitesQuery.data);
  // console.log(agencies, invites);

  className = createClassName(className, 'brand-card-list');

  const view = ['no-brands', 'one-brand', 'two-brands'][agencies.length] ?? 'many-brands';

  return (
    <div className={ className } { ...props } data-view={ view } style={{ '--item-count': agencies.length + 1 }}>
      <div>
        { agencies?.map((agency, index) => (
          <BrandCard key={ agency.uuid } agency={ agency } style={{ '--index': index }} />
        ))}
        <CreateBrandCard style={{ '--index': agencies.length }}/>
      </div>
    </div>
  );
};

export default BrandCardList;
