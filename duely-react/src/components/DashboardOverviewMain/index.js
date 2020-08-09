import React from 'react';
import { createClassName } from 'utils';
import Card from 'components/Card';
import Button from 'components/Button';
import ClientsOverviewList from 'components/ClientsOverviewList';
import useRoute from 'hooks/useRoute';

const DashboardOverviewMain = React.forwardRef(({ className, ...props }, ref) => {
  const { data: agency } = useRoute();
  className = createClassName(className, 'g-1 pb-4');
  return (
    <div className={ className } { ...props } ref={ ref }>
      <Card className="gap-3 shadow-b w-100">
        <h3>Clients overview</h3>
        <Button color="primary" filled dense>Add client</Button>
        <ClientsOverviewList agencyUuid={ agency.uuid } />
      </Card>
    </div>
  );
});

export default DashboardOverviewMain;
