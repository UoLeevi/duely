import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useQuery } from '@apollo/client';
import { createClassName } from 'utils';
import queries from 'apollo/queries';
import Chip from 'components/Chip';
import Table from 'components/Table';

const statusColors = {
  'live': 'success',
  'draft': 'accent'
};

const ServicesOverviewList = React.forwardRef(({ agencyUuid, className, ...props }, ref) => {
  const servicesQuery = useQuery(queries.services.query, { variables: { agencyUuid: agencyUuid } });
  const services = queries.services.result(servicesQuery.data);
  className = createClassName(className, 'services-overview-list');

  const columns = [
    { key: 'name' },
    { key: 'status', justify: 'center' },
    { key: 'menu', justify: 'center' }
  ];

  const rows = services && services.map(service => {

    return {
      key: service.uuid,
      name: (
        <div className="flex column">
          <span className="f-1 f-b">{ service.name }</span>
        </div>
      ),
      status: <Chip color={ statusColors[service.status] }>{ service.status }</Chip>,
      menu: <BsThreeDotsVertical className="background color-s1n color-l1n" />
    };
  });

  return (
    <Table className={ className } { ...props } ref={ ref } loading={ servicesQuery.loading }
      columns={ columns }
      rows={ rows }
    />
  );
});

export default ServicesOverviewList;
