import {
  getServiceAccountContext,
  ResourceId,
  updateProcessingState,
  withSession
} from '@duely/db';
import { sendEmailNotificationAboutNewSales } from '@duely/email';
import { runLambda } from '@duely/lambda';

const order_id = process.argv[2] as ResourceId<'order'>;

main();

async function main() {
  const context = await getServiceAccountContext();
  console.log(`Order processing started for order: ${order_id}`);
  try {
    await updateProcessingState(context, 'order', order_id, 'processing');
    await withSession(context, async ({ queryResource, queryResourceAll, commit }) => {
      const order = await queryResource('order', order_id);

      if (!order) {
        throw new Error(`Order ${order_id} not found`);
      }

      const items = await queryResourceAll('order item', { order_id: order.id });

      for (const item of items) {
        if (item.state === 'processed' || item.state === 'processing') continue;
        await updateProcessingState(context, 'order item', item.id, 'processing');
        await commit();

        try {
          const price = await queryResource('price', item.price_id);
          const product = await queryResource('product', price.product_id);
          const integrations = await queryResourceAll('integration', { product_id: product.id });

          for (const integration of integrations) {
            const integration_type = await queryResource(
              'integration type',
              integration.integration_type_id
            );
            await runLambda(`integration/${integration_type.name}`, item.id!);
          }

          await updateProcessingState(context, 'order item', item.id, 'processed');
        } catch (err: any) {
          console.error(`Order item processing failed:\n${err}`);
          await updateProcessingState(context, 'order item', item.id, err);
          throw err;
        }
      }
    });

    await updateProcessingState(context, 'order', order_id, 'processed');
  } catch (err: any) {
    console.error(`Order processing failed:\n${err}`);
    await updateProcessingState(context, 'order', order_id, err);
    throw err;
  }

  try {
    await sendEmailNotificationAboutNewSales(order_id);
  } catch (error: any) {
    console.error('Error while trying to send new sales notification email:', error.message);
  }
}
