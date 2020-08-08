import React from 'react';
import Card from 'components/Card';
import Button from 'components/Button';
import { createClassName } from 'utils';

const DashboardOverviewMain = React.forwardRef(({ className, ...props }, ref) => {
  className = createClassName(className, 'g-1 pb-4');
  return (
    <div className={ className } { ...props } ref={ ref }>
      <Card className="shadow-b">
        <Button color="primary" filled dense>Add client</Button>
      </Card>
    </div>
  );
});

export default DashboardOverviewMain;
