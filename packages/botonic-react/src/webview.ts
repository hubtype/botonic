
import axios from 'axios'


const BOTONIC_URL = process.env.BOTONIC_URL || 'https://api.hubtype.com'

var MessengerExtensions: any;

export class BotonicWebview {

	static async close(context, payload) {
		if (payload) {
			const contextUrl = BOTONIC_URL + '/v1/bots/' + context.bot.id + '/send_postback/'
			try {
				let resp = await axios({
					method: 'post',
					url: contextUrl,
					data: { payload: payload, chat_id: context.user.id }
				})
			} catch (e) {
				console.log(e)
			}
		}
		MessengerExtensions.requestCloseBrowser(() => { }, (err) => console.log(err))
	}
}