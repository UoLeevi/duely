import { withSession } from '@duely/db';
import { setResult } from '@duely/lambda';
import axios from 'axios';

const context = { jwt: process.argv[2] };
const price_id = process.argv[3];
const customer_id = process.argv[4];

main();

// see: https://docs.teachable.com/reference#apiv1sale

async function main() {
  try {
    await withSession(context, async ({ queryResource }) => {
      const price = await queryResource(price_id);
      const product = await queryResource(price.product_id);
      const customer = await queryResource(customer_id);
      const integration = await queryResource(product.integration_id);

      if (!integration || integration.name != 'teachable/enroll') {
        throw new Error(`No teachable/enroll integration found for product ${product.id}`);
      }

      const credential = await queryResource(integration.credential_id);

      if (!credential) {
        throw new Error(`No credentials found for integration ${integration.id}`);
      }

      const url = new URL('/api/v1/sales', `https://${integration.data.school_domain}`).toString();

      const result = await axios.post(
        url,
        {
          email: customer.email_address,
          price: price.unit_amount,
          product_id: integration.data.product_id,
          name: integration.data.name
        },
        {
          auth: {
            username: credential.username,
            password: credential.password
          }
        }
      );

      setResult({ success: true, enrollment_id: result.data.id });
    });
  } catch (err) {
    console.error(`integration/teachable/enroll failed:\n${err}`);
  }
}
