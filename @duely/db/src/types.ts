export type Resource = {
  id: string;
};

export type SubdomainResource = Resource & {
  name: string;
  livemode: boolean;
  agency: AgencyResource;
};

export type AgencyResource = Resource & {
  name: string;
  livemode: boolean;
  subdomain: SubdomainResource;
};

export type ResourceTypes = {
  agency: AgencyResource;
  subdomain: SubdomainResource;
};
