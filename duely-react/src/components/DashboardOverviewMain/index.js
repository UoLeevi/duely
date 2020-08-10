import React from 'react';
import { createClassName } from 'utils';
import Card from 'components/Card';
import Button from 'components/Button';
import ClientsOverviewList from 'components/ClientsOverviewList';
import ServicesOverviewList from 'components/ServicesOverviewList';
import AddClientForm from 'components/AddClientForm';
import CreateServiceForm from 'components/CreateServiceForm';
import useRoute from 'hooks/useRoute';
import useModal from 'hooks/useModal';

const DashboardOverviewMain = React.forwardRef(({ className, ...props }, ref) => {
  const { data: agency } = useRoute();

  const showAddClientModal = useModal(<AddClientForm agencyUuid={ agency.uuid } />);
  const showCreateServiceModal = useModal(<CreateServiceForm agencyUuid={ agency.uuid } />);

  className = createClassName(className, 'flex column g-1 pb-4 gap-3');
  return (
    <div className={ className } { ...props } ref={ ref }>
      <Card className="gap-3 shadow-b w-100">
        <div className="flex row space-between w-100">
          <h3>Clients overview</h3>
          <Button color="primary" className="f-1" filled dense onClick={ showAddClientModal }>Add client</Button>
        </div>
        <ClientsOverviewList agencyUuid={ agency.uuid } />
      </Card>
      <Card className="gap-3 shadow-b w-100">
        <div className="flex row space-between w-100">
          <h3>Services overview</h3>
          <Button color="primary" className="f-1" filled dense onClick={ showCreateServiceModal }>Create service</Button>
        </div>
        <ServicesOverviewList agencyUuid={ agency.uuid } />
      </Card>
    </div>
  );
});

export default DashboardOverviewMain;
