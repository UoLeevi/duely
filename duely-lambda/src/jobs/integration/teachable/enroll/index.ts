import { withSession } from '@duely/db';
import { setResult } from '@duely/lambda';
import axios from 'axios';

const context = { jwt: process.argv[2] };
const order_item_id = process.argv[3];

main();

// see: https://docs.teachable.com/reference#apiv1sale

async function main() {
  try {
    await withSession(context, async ({ queryResource }) => {
      const order_item = await queryResource('order item', order_item_id);
      const order = await queryResource('order', order_item.order_id);
      const price = await queryResource('price', order_item.price_id);
      const product = await queryResource('product', price.product_id);
      const customer = await queryResource('customer', order.customer_id);
      const integration = await queryResource('integration', product.integration_id!);

      if (!integration || integration.name != 'teachable/enroll') {
        throw new Error(`No teachable/enroll integration found for product ${product.id}`);
      }

      const credential = await queryResource('credential', integration.credential_id!);

      if (!credential || credential.type != 'basic') {
        throw new Error(`No credentials with basic type found for integration ${integration.id}`);
      }

      const integrationData = integration.data as {
        school_domain: string;
        product_id: string;
      };

      const credentialData = credential.data as {
        username: string;
        password: string;
      };

      const url = new URL('/api/v1/sales', `https://${integrationData.school_domain}`).toString();

      const result = await axios.post(
        url,
        {
          email: customer.email_address,
          price: price.unit_amount,
          product_id: integrationData.product_id,
          name: customer.name,
          src: order_item_id
        },
        {
          auth: {
            username: credentialData.username,
            password: credentialData.password
          }
        }
      );

      setResult({ success: true, enrollment_id: result.data.id });
    });
  } catch (err) {
    console.error(`integration/teachable/enroll failed:\n${err}`);
  }
}
