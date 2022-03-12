import { Card, Form, Section } from '@duely/react';
import { DashboardSection } from '../../components';
import { SettingsIntegrationsSettingsForm } from './components/SettingsIntegrationsSettingsForm';

export default function DashboardSettingsIntegrations() {
  return (
    <>
      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Settings</Section.Heading>
        <Form.Section
          title="Integrations"
          description={
            <span>Enable and configure integrations with external services and APIs.</span>
          }
        >
          <SettingsIntegrationsSettingsForm />
        </Form.Section>
      </Section>
    </>
  );
}
