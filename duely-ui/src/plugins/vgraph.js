import Vue from 'vue';
import Vgraph from '@/vgraph/lib';
import gql from 'graphql-tag';

Vue.use(Vgraph, {
  watchQuery: {
    query: gql`
      query {
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
