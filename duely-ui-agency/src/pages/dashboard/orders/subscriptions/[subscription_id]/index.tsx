import { agency_stripe_account_Q, subscription_Q, useQuery } from '@duely/client';
import {
  Box,
  Button,
  ColoredChip,
  DropMenu,
  Form,
  Modal,
  PropertyList,
  PropertyValue,
  Query,
  useForm,
  useModal,
  useQueryState
} from '@duely/react';
import React from 'react';
import { useParams } from 'react-router-dom';

export * from './components';
export * from './edit';

export function DashboardOrdersSubscription() {
  const { subscription_id } = useParams<{ subscription_id: string }>();
  const modal = useModal(false);
  const form = useForm();
  const stripeAccountControl = useQueryState(agency_stripe_account_Q);
  const { data: subscription, query } = useQuery(
    subscription_Q,
    (stripe_account) => ({
      stripe_account_id: stripe_account?.id!,
      subscription_id
    }),
    {
      deps: [stripeAccountControl]
    }
  );

  return (
    <>
      <Query state={query} queryKey={query.queryDef}>
        <Box>
          <Box.Heading subheading="Subscription" as="h2" dynamic>
            <div className="flex items-baseline space-x-3">
              <span>
                <span>{subscription?.customer?.name ?? subscription?.customer?.email}</span>
                <span className="text-xl font-normal text-gray-500"> on </span>
                <span className="text-xl font-normal text-gray-700">
                  {subscription?.items[0].price?.product?.name}
                </span>
              </span>
              <ColoredChip
                dense
                text={subscription?.status}
                color={{
                  incomplete: 'gray',
                  incomplete_expired: 'gray',
                  trialing: 'blue',
                  active: 'green',
                  past_due: 'orange',
                  canceled: 'gray',
                  unpaid: 'orange'
                }}
              />
            </div>
          </Box.Heading>

          <Box.Action>
            <div className="flex items-center">
              <DropMenu>
                <DropMenu.Button as={React.Fragment}>
                  <Button className="text-sm" dense icon="chevron-down.solid" icon-right>
                    Actions
                  </Button>
                </DropMenu.Button>
                <DropMenu.Item onClick={modal.open}>
                  <span className="text-red-600">Cancel subscription...</span>
                </DropMenu.Item>
              </DropMenu>
            </div>
          </Box.Action>

          <PropertyList col>
            <PropertyList.Item label="Started">
              <PropertyValue.Date>{subscription?.start_date}</PropertyValue.Date>
            </PropertyList.Item>
          </PropertyList>
        </Box>

        <Box>
          <Box.Heading as="h3">Subscription details</Box.Heading>

          <PropertyList>
            <PropertyList.Item label="Customer">
              <PropertyValue.Customer>
                {subscription?.customer?.customer?.id}
              </PropertyValue.Customer>
            </PropertyList.Item>
            <PropertyList.Item label="Product">
              <PropertyValue.Product>
                {subscription?.items[0].price?.product?.id}
              </PropertyValue.Product>
            </PropertyList.Item>
            <PropertyList.Item label="ID">
              <PropertyValue.Id>{subscription?.id}</PropertyValue.Id>
            </PropertyList.Item>
            <PropertyList.Item label="Current period">
              <PropertyValue.DateRange
                from={subscription?.current_period_start}
                to={subscription?.current_period_end}
              />
            </PropertyList.Item>
          </PropertyList>
        </Box>

        <Modal control={modal}>
          <Form form={form} onSubmit={(data) => console.log(data)}>
            <Modal.Body heading="Subscription cancellation">
              <Form.Label>Cancel</Form.Label>
              <Form.Field
                label="Immediately"
                value="immediately"
                name="cancellation_type"
                type="radio"
                dense
              />
              <Form.Field
                label="At end of current period"
                value="current_period_end"
                name="cancellation_type"
                type="radio"
                dense
              />
              <Form.Field
                label="At specific date"
                value="specific_date"
                name="cancellation_type"
                type="radio"
                dense
              />
            </Modal.Body>

            <Modal.Footer>
              <Form.Button type="submit" onClick={modal.close} dense loading={false} color="indigo">
                Cancel subscription
              </Form.Button>
              <Form.Button type="reset" onClick={modal.close} dense color="gray">
                Don't cancel
              </Form.Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Query>
    </>
  );
}
