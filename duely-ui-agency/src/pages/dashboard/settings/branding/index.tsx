import { Card, Form, Section } from '@duely/react';
import { DashboardSection } from '../../components';
import { SettingsBrandingSettingsForm } from './components/SettingsBrandingSettingsForm';

export default function DashboardSettingsBranding() {
  return (
    <>
      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Settings</Section.Heading>
          <Form.Section
            title="Branding"
            description={
              <span>
                With branding settings you can make the logos and colors on checkout pages, invoices and receipts to match your brand.
              </span>
            }
          >
            <SettingsBrandingSettingsForm />
          </Form.Section>
        </Section>
    </>
  );
}
