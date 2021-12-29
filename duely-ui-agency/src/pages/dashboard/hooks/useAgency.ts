import { agency_stripe_account_Q, current_agency_Q, useQuery } from '@duely/client';

export function useAgency() {
  const { data: agency, loading: agencyLoading, error: agencyError } = useQuery(current_agency_Q);
  const {
    data: stripe_account,
    loading: stripe_accountLoading,
    error: stripe_accountError
  } = useQuery(agency_stripe_account_Q, { agency_id: agency!.id }, { skip: !agency });

  return {
    agency,
    stripe_account,
    loading: agencyLoading || stripe_accountLoading,
    error: agencyError ?? stripe_accountError
  };
}
