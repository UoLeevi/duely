import { updateProcessingState, withSession } from '@duely/db';

const context = { jwt: process.argv[2] };
const order_id = process.argv[3];

main();

async function main() {
  console.log(`Order processing started for order: ${order_id}`);
  try {
    await updateProcessingState(context, order_id, 'processing');
    await withSession(context, async ({ queryResource, queryResourceAll }) => {
      const order = await queryResource(order_id);

      if (!order) {
        throw new Error(`Order ${order_id} not found`);
      }

      const items = await queryResourceAll('order item', { order_id });

      for (const item of items) {
        const price = await queryResource(item.price_id);
        const product = await queryResource(price.product_id);

        if (product.integration_id) {
          const integration = await queryResource(product.integration_id);
          // TODO: start job related to integration
        }
      }
    });
    await updateProcessingState(context, order_id, 'processed');
  } catch (err) {
    console.error(`Order processing failed:\n${err}`);
    await updateProcessingState(context, order_id, err);
  }
}
