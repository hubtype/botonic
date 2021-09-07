export function botExecutorHandlerFactory(env, botExecutor) {
  if (env === 'local') return botExecutor
  if (env === 'aws') {
    return async function (event, context) {
      try {
        const params = JSON.parse(event.Records[0].body)
        await botExecutor(params)
      } catch (e) {}
      return {
        statusCode: 200,
      }
    }
  }
}
