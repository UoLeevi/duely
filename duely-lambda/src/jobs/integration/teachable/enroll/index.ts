import { getServiceAccountContext, withSession } from '@duely/db';
import { setResult } from '@duely/lambda';
import axios from 'axios';

const order_item_id = process.argv[2];

main();

// see: https://docs.teachable.com/reference#apiv1sale

async function main() {
  const context = await getServiceAccountContext();

  try {
    await withSession(context, async ({ queryResource }) => {
      const integration_type = await queryResource('integration type', {
        name: 'teachable/enroll'
      });
      const order_item = await queryResource('order item', order_item_id);
      const order = await queryResource('order', order_item.order_id);
      const price = await queryResource('price', order_item.price_id);
      const product = await queryResource('product', price.product_id);
      const customer = await queryResource('customer', order.customer_id);
      const integration = await queryResource('integration', {
        product_id: product.id,
        integration_type_id: integration_type.id
      });

      if (!integration) {
        throw new Error(`No teachable/enroll integration found for product ${product.id}`);
      }

      if (!integration.integration_config_id) {
        throw new Error(`No integration config specified for integration ${integration.id}`);
      }

      const integration_config = await queryResource(
        'integration config',
        integration.integration_config_id
      );

      const credential_id = integration.credential_id ?? integration_config.credential_id;

      if (!credential_id) {
        throw new Error(`No credentials found for integration ${integration.id}`);
      }

      const credential = await queryResource('credential', credential_id);

      const integrationConfigData = integration_config.data as {
        school_domain: string;
      };

      const integrationData = integration.data as {
        product_id: string;
      };

      const credentialData = credential.data as {
        email_address: string;
        password: string;
      };

      const url = new URL(
        '/api/v1/sales',
        `https://${integrationConfigData.school_domain}`
      ).toString();

      try {
        const result = await axios.post(
          url,
          {
            email: customer.email_address,
            price: price.unit_amount,
            product_id: +integrationData.product_id,
            name: customer.name ?? customer.email_address,
            src: order_item_id
          },
          {
            auth: {
              username: credentialData.email_address,
              password: credentialData.password
            }
          }
        );

        setResult({ success: true, enrollment_id: result.data.id });
        console.log(
          `Integration teachable/enroll completed for order item: ${order_item_id}. Enrollment id: ${result.data.id}`
        );
      } catch (err: any) {
        if (err.response) {
          // Request made and server responded
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', err.message);
        }

        throw err;
      }
    });
  } catch (err: any) {
    console.error(`integration/teachable/enroll failed.`);

    throw err;
  }
}
