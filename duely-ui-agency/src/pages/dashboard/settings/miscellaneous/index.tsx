import { Card, Form, Section } from '@duely/react';
import { DashboardSection } from '../../components';
import { SettingsMiscellaneousSettingsForm } from './components/SettingsMiscellaneousSettingsForm';

export default function DashboardSettingsMiscellaneous() {
  return (
    <>
      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Settings</Section.Heading>
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
      </Section>
    </>
  );
}
