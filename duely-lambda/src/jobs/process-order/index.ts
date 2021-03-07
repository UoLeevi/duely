
type ProcessingState = 'pending' | 'processing' | 'processed' | 'failed';

const context = { jwt: process.argv[2] };
const order_id = process.argv[3];

main();

async function main() {
  console.log(`Order processing started for order: ${order_id}`);
}
