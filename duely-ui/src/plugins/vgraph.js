import Vue from 'vue';
import Vgraph from '@/vgraph/lib';
import gql from 'graphql-tag';

Vue.use(Vgraph, {
  watchQuery: {
    query: gql`
      query {
        session @client {
          agency {
            uuid
            name
            servicesConnection {
              edges {
                cursor
                node {
                  uuid
                  name
                  status
                  agency {
                    uuid
                    name
                  }
                }
              }
            }
          }
        }
        me {
          uuid
          name
          emailAddress
          type
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
                subjectsConnection {
                  edges {
                    cursor
                    roles
                    node {
                      uuid
                      name
                      type
                      emailAddress
                    }
                  }
                }
                servicesConnection {
                  edges {
                    cursor
                    node {
                      uuid
                      name
                      status
                      agency {
                        uuid
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    //notifyOnNetworkStatusChange: true
  }
});

export default new Vgraph();
