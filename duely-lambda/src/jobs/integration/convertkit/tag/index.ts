import { getServiceAccountContext, withSession } from '@duely/db';
import { setResult } from '@duely/lambda';
import axios from 'axios';

const order_item_id = process.argv[2];

main();

// see: https://developers.convertkit.com/#tag-a-subscriber

async function main() {
  const context = await getServiceAccountContext();

  try {
    await withSession(context, async ({ queryResource }) => {
      const integration_type = await queryResource('integration type', {
        name: 'convertkit/tag'
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
        throw new Error(`No convertkit/tag integration found for product ${product.id}`);
      }

      if (!integration.integration_config_id) {
        throw new Error(`No integration config specified for integration ${integration.id}`);
      }

      const integration_config = await queryResource(
        'integration config',
        integration.integration_config_id
      );

      const integrationConfigData = integration_config.data as {
        convertkit_api_key: string;
      };

      const integrationData = integration.data as {
        convertkit_tag_id: string;
      };

      const url = `https://api.convertkit.com/v3/tags/${integrationData.convertkit_tag_id}/subscribe`;

      const result = await axios.post(url, {
        api_key: integrationConfigData.convertkit_api_key,
        email: customer.email_address
      });

      setResult({ success: true, tagment_id: result.data.id });
      console.log(
        `Integration convertkit/tag completed for order item: ${order_item_id}. Enrollment id: ${result.data.id}`
      );
    });
  } catch (err: any) {
    console.error(`integration/convertkit/tag failed.`);

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
}
