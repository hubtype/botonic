import React from 'react'

export default class extends React.Component {

    static async botonicInit({ req }) {
        /*
        Here we define the data that will be passed to the bot
        You don't have to worry of how this data is passed to the webview, we managed it for you!
        */

        req.context.some_data = "some_data"
    }

    render() {
        //Here we render a Facebook Carrousel with its propers assets and url routes for these webviews
        return (
            <messages>
                <message type="text">
                    Here I lend you some options of how helpful the use of Facebook webviews could be.
                </message>
                <message type="carrousel">
                    <element>
                        <pic>/assets/bot_vader.jpeg</pic>
                        <title>ReactJs Components</title>
                        <desc>This will prompt a webview with a component</desc>
                        <button webview_height_ratio="compact" url="/webviews/my_webview">Go</button>
                    </element>
                    <element>
                        <pic>/assets/interact_with_bot.jpeg</pic>
                        <title>Interacting with the bot</title>
                        <desc>See how the communication bot-webview is done</desc>
                        <button webview_height_ratio="tall" url="/webviews/interaction_with_bot">Go</button>
                    </element>
                </message>
            </messages>
        )
    }
}
