import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useQuery } from '@apollo/client';
import { createClassName } from 'utils';
import queries from 'apollo/queries';
import Chip from 'components/Chip';
import Table from 'components/Table';

const statusColors = {
  active: 'success'
};

const ClientsOverviewList = React.forwardRef(({ agencyUuid, className, ...props }, ref) => {
  const clientsQuery = useQuery(queries.clients.query, { variables: { agencyUuid: agencyUuid } });
  const clients = queries.clients.result(clientsQuery.data);
  className = createClassName(className, 'clients-overview-list');

  const columns = [
    { key: 'name' },
    { key: 'status', justify: 'center' },
    { key: 'menu', justify: 'center' }
  ];

  const rows = clients && clients.map(client => {
    return {
      key: client.uuid,
      name: (
        <div className="flex column">
          <span className="f-1 f-b">{ client.name }</span>
          <span className="f-1 f-b background color-s1n color-l2n">{ client.emailAddress }</span>
        </div>
      ),
      status: <Chip color={ statusColors[client.status] }>{ client.status }</Chip>,
      menu: <BsThreeDotsVertical className="background color-s1n color-l1n" />
    };
  });

  return (
    <Table className={ className } { ...props } ref={ ref } loading={ clientsQuery.loading }
      columns={ columns }
      rows={ rows }
    />
  );
});

export default ClientsOverviewList;
