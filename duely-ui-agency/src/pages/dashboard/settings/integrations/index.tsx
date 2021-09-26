import { Card, Form } from '@duely/react';
import { DashboardSection } from '../../components';
import { SettingsIntegrationsSettingsForm } from './components/SettingsIntegrationsSettingsForm';

export default function DashboardSettingsIntegrations() {
  return (
    <>
      <DashboardSection title="Integrations">
        <Card>
          <Form.Section
            title="Integrations"
            description={
              <span>Enable and configure integrations with external services and APIs.</span>
            }
          >
            <SettingsIntegrationsSettingsForm />
          </Form.Section>
        </Card>
      </DashboardSection>
    </>
  );
}
