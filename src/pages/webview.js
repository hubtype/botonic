import React from 'react'
import Head from 'next/head'
import axios from 'axios'

const BOTONIC_URL = process.env.BOTONIC_URL || 'https://api.hubtype.com'

export default class BotonicWebview extends React.Component {

	static async close (context, payload) {
      if(payload) {
	      const contextUrl = BOTONIC_URL + '/v1/bots/'+ context.bot.id +'/send_postback/'
	      let resp = axios({
	        method: 'post',
	        url: contextUrl,
	        data: {payload: payload, chat_id: context.user.id}
	      })
	  }
      MessengerExtensions.requestCloseBrowser(() => {}, (err) => {})
	}
	
  	render() {
		return (
		    <Head>
			  <script dangerouslySetInnerHTML={{__html: `
			  (function(d, s, id){
			    var js, fjs = d.getElementsByTagName(s)[0];
			    if (d.getElementById(id)) {return;}
			    js = d.createElement(s); js.id = id;
			    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
			    fjs.parentNode.insertBefore(js, fjs);
			  }(document, 'script', 'Messenger'));
			`}} />
			</Head>
		)
	}
}