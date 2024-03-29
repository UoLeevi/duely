import { Card, Form, Section } from '@duely/react';
import { DashboardSection } from '../../components';
import { SettingsCheckoutSettingsForm } from './components/SettingsCheckoutSettingsForm';

export default function DashboardSettingsCheckout() {
  return (
    <>
      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Settings</Section.Heading>
        <Form.Section
          title="Checkout"
          description={
            <span>
              By default, after a successful checkout, customers will be redirected to a default
              thank you page hosted on Duely. Alternatively, you can set custom URLs for the thank
              you pages.
              <br />
              <br />
              Custom thank you page URL can be set on both agency level and on product level. If the
              thank you page URL is set on both agency level and product level, the product level
              setting will be used. To set the thank you page URL on the product level, please edit
              an individual product settings.
            </span>
          }
        >
          <SettingsCheckoutSettingsForm />
        </Form.Section>
      </Section>
    </>
  );
}
