exports.default = {
  region: process.env.AWS_REGION,
  profile: process.env.AWS_PROFILE,
  tags: {
    Scope: 'Botonic-1.0',
    Maintainer: 'team.botonic',
  },
  // customDomain: 'bot-1.sandbox0.hubtype.com',
  projectName: 'botonic',
  stackName: 'dev',
  tableName: 'dev_user_events',
}
