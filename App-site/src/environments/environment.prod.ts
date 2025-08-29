export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api', // TODO: Substituir pela URL de produção
  
  msalConfig: {
    auth: {
      clientId: 'c3e1d930-5025-4441-b5ea-3dc880eec76a',
      authority: 'https://login.microsoftonline.com/5c0e4460-04a1-4ddf-88e0-d6dd3705867b',
      redirectUri: 'https://your-frontend-domain.com', // TODO: Substituir pela URL de produção
      postLogoutRedirectUri: 'https://your-frontend-domain.com' // TODO: Substituir pela URL de produção
    },
    apiScopes: {
      api: 'api://c3e1d930-5025-4441-b5ea-3dc880eec76a/access_as_user'
    }
  }
};
