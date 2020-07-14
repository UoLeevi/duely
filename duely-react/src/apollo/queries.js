import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query {
    me {
      uuid
      name
      emailAddress
      type
    }
  }
`;

export const PROFILE_QUERY = gql`
  query {
    me {
      uuid
      name
      invitesConnection {
        edges {
          node {
            uuid
            status
            agency {
              uuid
              name
              subdomain {
                uuid
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const PORTAL_QUERY = gql`
  query($subdomainName: String) {
    agency(subdomainName: $subdomainName) {
      uuid
      name
      theme {
        uuid
        name
        imageLogo {
          uuid
          name
          data
          color
        }
        imageHero {
          uuid
          name
          data
          color
        }
        colorPrimary
        colorSecondary
        colorAccent
        colorBackground
        colorSurface
        colorError
        colorSuccess
      }
      servicesConnection {
        edges(status: "live") {
          cursor
          node {
            uuid
            name
            status
            steps {
              uuid
              name
              type
            }
          }
        }
      }
    }
  }
`;

export const DASHBOARD_QUERY = gql`
  query($subdomainName: String) {
    agency(subdomainName: $subdomainName) {
      uuid
      name
      theme {
        uuid
        name
        imageLogo {
          uuid
          name
          data
          color
        }
        imageHero {
          uuid
          name
          data
          color
        }
        colorPrimary
        colorSecondary
        colorAccent
        colorBackground
        colorSurface
        colorError
        colorSuccess
      }
      servicesConnection {
        edges {
          cursor
          node {
            uuid
            name
            status
            steps {
              uuid
              name
              type
            }
          }
        }
      }
      subjectsConnection {
        edges {
          cursor
          roles
          node {
            uuid
            name
            emailAddress
          }
        }
      }
    }
  }
`;

export const AGENCY_QUERY = gql`
  query($subdomainName: String) {
    agency(subdomainName: $subdomainName) {
      uuid
      name
      theme {
        uuid
        name
        imageLogo {
          uuid
          name
          data
          color
        }
        imageHero {
          uuid
          name
          data
          color
        }
        colorPrimary
        colorSecondary
        colorAccent
        colorBackground
        colorSurface
        colorError
        colorSuccess
      }
    }
  }
`;

export const AGENCY_ROLES_QUERY = gql`
  query($agencyUuids: [ID!]) {
    me {
      uuid
      name
      type
      agenciesConnection {
        edges(uuids: $agencyUuids) {
          node {
            uuid
          }
          roles
        }
      }
    }
  }
`;
