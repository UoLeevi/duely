import { subscription_Q, useQuery } from '@duely/client';
import {
  Card,
  ColoredChip,
  Form,
  PropertyList,
  TimeConversionTooltip,
  Tooltip
} from '@duely/react';
import { formatDate } from '@duely/util';
import { useParams } from 'react-router-dom';
import { useAgency } from '~/pages/dashboard/hooks/useAgency';
import { DashboardSection } from '../../../components';

export default function DashboardOrdersEditSubscription() {
  const { subscription_id } = useParams<{ subscription_id: string }>();
  const { agency, stripe_account, loading: agencyLoading, error: agencyError } = useAgency();
  const { data: subscription, loading: subscriptionLoading } = useQuery(
    subscription_Q,
    {
      stripe_account_id: stripe_account?.id!,
      subscription_id
    },
    {
      skip: !stripe_account
    }
  );

  return (
    <>
      <DashboardSection
        title={
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Subscription</span>
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
          </div>
        }
        loading={subscriptionLoading}
      >
        <Card>
          <div className="m-4">
            <PropertyList>
              <PropertyList.Item label="Started">
                <span
                  data-tooltip="started-tooltip"
                  className="underline underline-offset-2 hover:bg-black/5"
                >
                  {formatDate(subscription?.start_date, 'mmm d, yyyy', { tz: 'local' })}
                </span>
                <TimeConversionTooltip id="started-tooltip" date={subscription?.start_date} />
              </PropertyList.Item>
            </PropertyList>
          </div>

          <Form.Section title="Subscription details">
            <PropertyList>
              <PropertyList.Item label="Customer">
                {subscription?.customer?.name ?? subscription?.customer?.email}
              </PropertyList.Item>
              <PropertyList.Item label="Product">
                {subscription?.items[0].price?.product?.name}
              </PropertyList.Item>
              <PropertyList.Item label="ID">{subscription?.id}</PropertyList.Item>
              <PropertyList.Item label="Current period">
                <span
                  data-tooltip="current_period_start-tooltip"
                  className="underline underline-offset-2 hover:bg-black/5"
                >
                  {formatDate(subscription?.current_period_start, 'mmm d', { tz: 'local' })}
                </span>
                <TimeConversionTooltip
                  id="current_period_start-tooltip"
                  date={subscription?.current_period_start}
                />
                <span> to </span>
                <span
                  data-tooltip="current_period_end-tooltip"
                  className="underline underline-offset-2 hover:bg-black/5"
                >
                  {formatDate(subscription?.current_period_end, 'mmm d, yyyy', { tz: 'local' })}
                </span>
                <TimeConversionTooltip
                  id="current_period_end-tooltip"
                  date={subscription?.current_period_end}
                />
              </PropertyList.Item>
            </PropertyList>
          </Form.Section>
        </Card>
      </DashboardSection>
    </>
  );
}
