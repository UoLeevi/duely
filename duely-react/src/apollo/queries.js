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
    result: d => d?.me
  },
  countryCodes: {
    query: gql`
      query {
        countryCodes
      }
    `,
    result: d => d?.countryCodes
  },
  agencies: {
    query: gql`
      query {
        me {
          uuid
          agenciesConnection {
            edges {
              cursor
              roles
              node {
                uuid
                name
                subdomain {
                  uuid
                  name
                }
                theme {
                  uuid
                  name
                  imageLogo {
                    uuid
                    name
                    color
                    data
                  }
                  imageHero {
                    uuid
                    name
                    color
                    data
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
          }
        }
      }
    `,
    result: d => d?.me.agenciesConnection.edges
      .map(edge => ({ ...edge.node, roles: edge.roles }))
  },
  invites: {
    query: gql`
      query {
        me {
          uuid
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
    result: d => d?.me.invitesConnection.edges
      .map(edge => edge.node)
      .filter(invite => invite.status === null)
  },
  profile: {
    query: gql`
      query {
        me {
          uuid
          name
          agenciesConnection {
            edges {
              cursor
              roles
              node {
                uuid
                name
                subdomain {
                  uuid
                  name
                }
                theme {
                  uuid
                  name
                  imageLogo {
                    uuid
                    name
                    color
                    data
                  }
                  imageHero {
                    uuid
                    name
                    color
                    data
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
          }
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
    result: d => d?.me
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
    result: d => d?.agency
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
    result: d => d?.agency
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
    result: d => d?.agency
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
    result: d => d?.me.agenciesConnection
  },
  clients: {
    query: gql`
      query($agencyUuid: ID!) {
        agency(uuid: $agencyUuid) {
          uuid
          name
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
          invitesConnection {
            edges {
              cursor
              node {
                uuid
                status
                inviteeEmailAddress
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
    result: d => {
      const users = d?.agency.subjectsConnection.edges
        .filter(edge => edge.roles.includes('client'))
        .map(edge => edge.node)
        .map(user => ({ ...user, status: 'active' }));

      const invited = d?.agency.invitesConnection.edges
        .map(edge => edge.node)
        .filter(invite => invite.status === null)
        .map(invite => ({ name: invite.inviteeEmailAddress, emailAddress: invite.inviteeEmailAddress, status: 'invited' }));

      return [...(users ?? []), ...(invited ?? [])];
    }
  }
};
