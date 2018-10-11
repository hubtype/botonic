
import axios from 'axios'

declare global {
	interface Window { MessengerExtensions: any; }
}

window.MessengerExtensions = window.MessengerExtensions || {};

export class BotonicWebview {

	static async close(context, payload) {
		if (payload) {
			try {
				let base_url = context._hubtype_api || 'https://api.hubtype.com'
				let resp = await axios({
					method: 'post',
					url: `${base_url}/v1/bots/${context.bot.id}/send_postback/`,
					data: { payload: payload, chat_id: context.user.id }
				})
			} catch (e) {
				console.log(e)
			}
		}
		window.MessengerExtensions.requestCloseBrowser(() => { }, (err) => console.log(err))
	}
}