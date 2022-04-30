import React from 'react';
import { createClassName } from '@duely/util';
import Markdown from 'markdown-to-jsx';
import { PageLayout } from '@duely/react';

export type AboutProps = {
  children: React.ReactNode;
  className?: string;
};

const md = `
## About
Duely.app is a software as a service (SaaS) product that allows individuals or businesses
to create products, services, and subscriptions to sell online. We use Stipe for payment processing.  

## Pricing
There are no monthly subscription fees when using Duely.app. For payments processed through Duely.app we charge 1% transaction fee in addition to standard transaction fees collected by [Stripe](https://stripe.com/en-fi/pricing#pricing-details).  

## Contact
Currently, Duely.app is still in development and access is by invite only.  

Our customers can contact us at:  
Phone number: +358 50 525 0727  
Email address: support@duely.app  

## Services Agreement
When doing business through Duely.app, you agree to our [Services Agreement](/services-agreement)
and the [Stripe Connected Account Agreement](https://stripe.com/connect-account/legal).`;

export function About({ children, className }: AboutProps) {
  className = createClassName(className, 'prose-sm prose prose-indigo');
  return (
    <PageLayout>
      <div className={className}>
        <Markdown>{md}</Markdown>
      </div>
    </PageLayout>
  );
}
