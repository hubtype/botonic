export const sendEvents = async ({
  user,
  events,
  sender,
  eventHandlers = {},
}) => {
  for (const event of events) {
    await sender({ user, event })
    if ('onActionSent' in eventHandlers) {
      // @ts-ignore
      await eventHandlers.onActionSent({ user, details: event })
    }
  }
}
