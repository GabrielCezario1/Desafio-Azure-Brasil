export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api',
  
  msalConfig: {
    auth: {
      clientId: 'c3e1d930-5025-4441-b5ea-3dc880eec76a',
      authority: 'https://login.microsoftonline.com/5c0e4460-04a1-4ddf-88e0-d6dd3705867b',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200'
    },
    apiScopes: {
      api: 'api://c3e1d930-5025-4441-b5ea-3dc880eec76a/access_as_user',
      graph: {
        user: 'User.Read',
        userAll: 'User.Read.All',
        directory: 'Directory.Read.All',
        group: 'Group.Read.All',
        profile: 'profile',
        email: 'email',
        openid: 'openid'
      }
    }
  }
};