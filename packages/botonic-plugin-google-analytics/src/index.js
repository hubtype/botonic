import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

export default class BotonicPluginGoogleAnalytics {
  /**
   * @param {Object} options - Options for the plugin
   * @param {string} options.trackingId - Tracking ID for Google Analytics.
   * @param {function({session: object}): string} [options.getUserId] - Method that returns a unique user ID as string.
   * @param {function({session: object}): object} [options.getUserTraits] - Method that returns the user traits as object.
   * @param {boolean} [options.automaticTracking] - If set to false, no automatic tracking will be done in post method.
   * @param {function({session: object, input: object, lastRoutePath: string}): object} [options.getEventFields] - Method
   *    that returns the eventFields to track as object (used only if automaticTracking is not set or set to true).
   */
  constructor(options) {
    this.getUserId = options.getUserId ?? this.defaultGetUserId
    this.getUserTraits = options.getUserTraits ?? this.defaultGetUserTraits
    this.getEventFields = options.getEventFields ?? this.defaultGetEventFields
    this.automaticTracking = options.automaticTracking ?? true
    this.analytics = Analytics({
      plugins: [
        googleAnalytics({
          trackingId: options.trackingId,
        }),
      ],
    })
  }

  async pre({ input, session, lastRoutePath }) {}

  async post({ input, session, lastRoutePath, response }) {
    if (this.automaticTracking) {
      await this.track({
        session,
        eventFields: this.getEventFields({ session, input, lastRoutePath }),
      })
    }
  }

  defaultGetUserId = ({ session }) => session.user.id

  defaultGetUserTraits = ({ session }) => ({
    userName: session.user.username,
    channel: session.user.provider,
    channelId: session.user.provider_id,
  })

  defaultGetEventFields = ({ session, input, lastRoutePath }) => ({
    category: session.bot.name,
    action: lastRoutePath,
    label: input.data,
  })

  /**
   * Track event to Google Analytics
   * @param {Object} session - Bot's session
   * @param {Object} eventFields - Event fields to send (see https://developers.google.com/analytics/devguides/collection/analyticsjs/events#event_fields)
   * @param {string} eventFields.category - Google Analytics eventCategory field
   * @param {string} eventFields.action - Google Analytics eventAction field
   * @param {string} [eventFields.label] - Google Analytics eventLabel field
   * @param {number} [eventFields.value] - Google Analytics eventValue field
   * @returns {Promise}
   */
  async track({ session, eventFields }) {
    if (!eventFields.action || !eventFields.category)
      throw new Error(
        'The eventFields object must contain the fields: action and category'
      )

    await this.analytics.identify(
      this.getUserId({ session }),
      this.getUserTraits({ session })
    )
    return this.analytics.track(eventFields.action, eventFields)
  }
}
