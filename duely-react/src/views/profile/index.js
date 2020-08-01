import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Choose from 'components/Choose';

const PROFILE_QUERY = gql`
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

const Profile = () => {
  const { loading, error, data } = useQuery(PROFILE_QUERY);

  return (
    <Choose index={ loading ? 0 : 1 }>
      <span>loading</span>
      <span>loaded</span>
    </Choose>
  );
};

export default Profile;
