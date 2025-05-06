import BotonicPluginDialogflow from '@botonic/plugin-dialogflow'

export const plugins = {
  dialogflow: new BotonicPluginDialogflow({
    credentials: {
      type: 'service_account',
      project_id: 'YOUR_PROJECT_ID',
      private_key_id: 'YOUR_PRIVATE_KEY_ID',
      private_key: 'YOUR_PRIVATE_KEY', // pragma: allowlist secret
      client_email: 'YOUR_CLIENT_EMAIL',
      client_id: 'CLIENT_ID',
      auth_uri: 'AUTH_URI',
      token_uri: 'TOKEN_URI',
      auth_provider_x509_cert_url: 'AUT_PROVIDER_X509_CERT_URL',
      client_x509_cert_url: 'CLIENT_X509_CERT_URL',
    },
  }),
}
