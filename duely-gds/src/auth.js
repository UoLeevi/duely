// https://developers.google.com/datastudio/connector/auth

var cc = DataStudioApp.createCommunityConnector();
var USERNAME_PROPERTY_PATH = 'dscc.username';
var TOKEN_PROPERTY_PATH = 'dscc.jwt';

// https://developers.google.com/datastudio/connector/auth#getauthtype
function getAuthType() {
  return cc
    .newAuthTypeResponse()
    .setAuthType(cc.AuthType.USER_PASS)
    .setHelpUrl('https://duely.app?login')
    .build();
}

// https://developers.google.com/datastudio/connector/auth#isauthvalid
function isAuthValid() {
  var userProperties = PropertiesService.getUserProperties();
  var jwt = userProperties.getProperty(TOKEN_PROPERTY_PATH);

  if (jwt == null)
    return false;

  var response = UrlFetchApp.fetch('https://api.duely.app/graphql', {
    method: 'post',
    contentType: 'application/json',
    headers: { authorization: 'Bearer ' + jwt },
    payload: JSON.stringify({
      query: 'query { me { type } }'
    })
  });

  var { data } = JSON.parse(response.getContentText());

  return data.me.type === 'user';
}

// https://developers.google.com/datastudio/connector/auth#setcredentials
function setCredentials(request) {
  var response = UrlFetchApp.fetch('https://api.duely.app/graphql', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      query: 'mutation { beginVisit { success jwt message } }'
    })
  });

  var { data } = JSON.parse(response.getContentText());

  if (!data.beginVisit.success) {
    console.log(data.beginVisit.message);
    return { errorCode: 'INVALID_CREDENTIALS' };
  }

  response = UrlFetchApp.fetch('https://api.duely.app/graphql', {
    method: 'post',
    contentType: 'application/json',
    headers: { authorization: 'Bearer ' + data.beginVisit.jwt },
    payload: JSON.stringify({
      query: 'mutation ($emailAddress: String!, $password: String!) { logIn(emailAddress: $emailAddress, password: $password) { success jwt message } }',
      variables: {
        emailAddress: request.userPass.username,
        password: request.userPass.password
      }
    })
  });

  ({ data } = JSON.parse(response.getContentText()));

  if (!data.logIn.success) {
    console.log(data.logIn.message);
    return { errorCode: 'INVALID_CREDENTIALS' };
  }

  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(USERNAME_PROPERTY_PATH, request.userPass.username);
  userProperties.setProperty(TOKEN_PROPERTY_PATH, data.logIn.jwt);

  return { errorCode: 'NONE' };
}

// https://developers.google.com/datastudio/connector/auth#resetauth
function resetAuth() {
  var userProperties = PropertiesService.getUserProperties();
  var jwt = userProperties.getProperty(TOKEN_PROPERTY_PATH);
  userProperties.deleteProperty(USERNAME_PROPERTY_PATH);
  userProperties.deleteProperty(TOKEN_PROPERTY_PATH);

  var response = UrlFetchApp.fetch('https://api.duely.app/graphql', {
    method: 'post',
    contentType: 'application/json',
    headers: { authorization: 'Bearer ' + jwt },
    payload: JSON.stringify({
      query: 'mutation { logOut { success message } }'
    })
  });

  var { data } = JSON.parse(response.getContentText());

  if (!data.logOut.success)
    console.log(data.logOut.message);
}
