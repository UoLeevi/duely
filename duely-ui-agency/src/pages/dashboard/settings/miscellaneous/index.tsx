import { Card, Form } from '@duely/react';
import { DashboardSection } from '../../components';
import { SettingsMiscellaneousSettingsForm } from './components/SettingsMiscellaneousSettingsForm';

export default function DashboardSettingsMiscellaneous() {
  return (
    <>
      <DashboardSection title="Settings">
        <Card>
          <Form.Section
            title="Miscellaneous"
            description={
              <span>
                You can change the default currency for your product prices here. The currency set
                will only affect newly created products and prices.
              </span>
            }
          >
            <SettingsMiscellaneousSettingsForm />
          </Form.Section>
        </Card>
      </DashboardSection>
    </>
  );
}
