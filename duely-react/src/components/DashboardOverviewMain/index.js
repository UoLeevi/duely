import React from 'react';
import { createClassName } from 'utils';
import Card from 'components/Card';
import Button from 'components/Button';
import ClientsOverviewList from 'components/ClientsOverviewList';
import AddClientForm from 'components/AddClientForm';
import useRoute from 'hooks/useRoute';
import useModal from 'hooks/useModal';

const DashboardOverviewMain = React.forwardRef(({ className, ...props }, ref) => {
  const { data: agency } = useRoute();

  const showAddClientModal = useModal(<AddClientForm agencyUuid={ agency.uuid } />);

  className = createClassName(className, 'g-1 pb-4');
  return (
    <div className={ className } { ...props } ref={ ref }>
      <Card className="gap-3 shadow-b w-100">
        <div className="flex row space-between w-100">
          <h3>Clients overview</h3>
          <Button color="primary" className="f-1" filled dense onClick={ showAddClientModal }>Add client</Button>
        </div>
        <ClientsOverviewList agencyUuid={ agency.uuid } />
      </Card>
    </div>
  );
});

export default DashboardOverviewMain;
