import { PageLayout } from '@duely/react';
import Markdown from 'markdown-to-jsx';

const markdown = `## Services Agreement

Payment processing services for agencies on Duely are provided by Stripe and are subject to the [Stripe Connected Account Agreement](https://stripe.com/connect-account/legal/full), which includes the [Stripe Terms of Service](https://stripe.com/legal) (collectively, the “Stripe Services Agreement”). By agreeing to this agreement or continuing to operate as a agency on Duely, you agree to be bound by the Stripe Services Agreement, as the same may be modified by Stripe from time to time. As a condition of duely enabling payment processing services through Stripe, you agree to provide Duely accurate and complete information about you and your business, and you authorize Duely to share it and transaction information related to your use of the payment processing services provided by Stripe.
`;

export default function Workspace() {
  return (
    <PageLayout className="prose prose-indigo">
      <Markdown>{markdown}</Markdown>
    </PageLayout>
  );
}
