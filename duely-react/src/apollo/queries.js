import { gql } from '@apollo/client';

export default {
  me: {
    query: gql`
      query {
        me {
          uuid
          name
          emailAddress
          type
        }
      }
    `,
    result: d => d['me']
  },
  profile: {
    query: gql`
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
    `,
    result: d => d['me']
  },
  portal: {
    query: gql`
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
    `,
    result: d => d['agency']
  },
  dashboard: {
    query: gql`
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
    `,
    result: d => d['agency']
  },
  agency: {
    query: gql`
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
    `,
    result: d => d['agency']
  },
  agencyRoles: {
    query: gql`
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
    `,
    result: d => d['me']['agenciesConnection']
  }
};
