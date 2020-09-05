let subdomainName = null;

if (process.env.NODE_ENV === 'production') {
  const names = window.location.hostname.split('.');
  
  if (names.length === 3)
    subdomainName = names[0].toLowerCase();

} else {
  const queryParams = new URLSearchParams(window.location.search);
  let name = queryParams.get('subdomain');

  if (name)
    subdomainName = name.toLowerCase();
}

export default {
  Query: {
    session() {
      if (!subdomainName)
        return {
          subdomainName: null,
          __typename: 'Session'
        };

      return {
        subdomainName,
        __typename: 'Session'
      };
    }
  }
};
