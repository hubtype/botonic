import React from 'react'
import Head from 'next/head'
import axios from 'axios'

const BOTONIC_URL = 'http://localhost:8000'

export default class BotonicWebview extends React.Component {

	static async close (context, payload) { 
      //console.log('closing', context);
      if(payload) {
	      const contextUrl = BOTONIC_URL + '/v1/bots/'+ context.bot.id +'/send_postback/'
	      let resp = axios({
	        method: 'post',
	        url: contextUrl,
	        data: {payload: payload, chat_id: context.user.id}
	      })
	  }
      //console.log('RESPONSE', resp)
      //http.POST /bots/send_postback?session_id=99987>&variable=value
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