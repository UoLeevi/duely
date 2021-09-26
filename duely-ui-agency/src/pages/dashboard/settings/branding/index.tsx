import { Card, Form } from '@duely/react';
import { DashboardSection } from '../../components';
import { SettingsBrandingSettingsForm } from './components/SettingsBrandingSettingsForm';

export default function DashboardSettingsBranding() {
  return (
    <>
      <DashboardSection title="Settings">
        <Card>
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
        </Card>
      </DashboardSection>
    </>
  );
}
