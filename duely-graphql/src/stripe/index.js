import https from 'https';
import querystring from 'querystring'

let countrySpecs = null;

async function updateCountrySpecs() {
  const countrySpecs = [];
  let has_more = true;

  while (has_more) {
    const starting_after = countrySpecs.length ? countrySpecs[countrySpecs.length - 1].id : null;
    const res = await fetchCountrySpecs(100, starting_after);
    countrySpecs.push(...res.data);
    has_more = res.has_more;
  }

  return countrySpecs;

  async function fetchCountrySpecs(limit, starting_after) {
    return await new Promise(async (resolve, reject) => {
      const d = [];

      if (limit)
        d.push(`limit=${limit}`);

      if (starting_after)
        d.push(`starting_after=${starting_after}`);

      const options = {
        hostname: 'api.stripe.com',
        port: 443,
        path: `/v1/country_specs${d.length ? `?${d.join('&')}` : ''}`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.STRIPE_SK_TEST}:`).toString('base64')}`
        }
      };
      
      const req = https.request(options, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', data => body += data );
        res.on('end', () => resolve(JSON.parse(body)));
      });
  
      req.on('error', reject);
      req.end();
    });
  }
}

async function createAccount(countryCode, agency_uuid_) {
  return await new Promise(async (resolve, reject) => {
    const d = [];

    var postData = querystring.stringify({
      type: 'custom',
      country: countryCode,
      'requested_capabilities[]': ['card_payments', 'transfers'],
      'metadata[agency_uuid_]': agency_uuid_
    });

    const options = {
      hostname: 'api.stripe.com',
      port: 443,
      path: `/v1/accounts`,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.STRIPE_SK_TEST}:`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };
    
    const req = https.request(options, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', data => body += data );
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function createAccountLink(acct_id, failure_url, success_url) {
  return await new Promise(async (resolve, reject) => {
    const d = [];

    var postData = querystring.stringify({
      account: acct_id,
      failure_url,
      success_url,
      type: 'custom_account_verification'
    });

    const options = {
      hostname: 'api.stripe.com',
      port: 443,
      path: `/v1/account_links`,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.STRIPE_SK_TEST}:`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };
    
    const req = https.request(options, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', data => body += data );
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

export default {
  async getCountrySpecs() {
    if (!countrySpecs)
      countrySpecs = updateCountrySpecs();

    return await countrySpecs;
  },
  createAccount,
  createAccountLink
};
