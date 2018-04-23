import dynamic from 'next/dynamic'
import React from 'react'
//const Message = dynamic(import('../botonic/message'))

export default class extends React.Component {

  static async getInitialProps({ req }) {
    const sponsors = [
        {name: 'Netlify', desc: 'Like AWS but better', url: 'www.netlify.com', pic: 'https://www.netlify.com/img/press/logos/logomark.jpg'},
        {name: 'Tokbox', desc: 'Video&voice for your apps', url: 'tokbox.com', pic: 'https://tokbox.com/blog/wp-content/uploads/2017/03/cropped-logo-tokbox-bug-square-512-287x287.png'},
        {name: 'Hasura', desc: 'Fullstack apps in mins', url: 'hasura.io', pic: 'https://pbs.twimg.com/profile_images/958257535915458560/UuzlIwbb_400x400.jpg'},
    ]
    return { sponsors }
  }

  render() {
    return (
        <messages>
            <message type="text">
                Great! Here we can see a carrousel. It's a Facebook Messenger component, and it's a
                group of elements which consists of an image, a title, a subtitle and a group of buttons.
            </message>
            <message type="carrousel">
                {this.props.sponsors.map((e, i) => 
                    <element key={e.name}>
                        <image>{e.pic}</image>
                        <title>{e.name}</title>
                        <desc>{e.desc}</desc>
                        <button href={e.url}>Visit website</button>
                    </element>
                )}
            </message>
            <message type="text">
                Now, let's see how a quickreply works. Please type 'quickreply'.
            </message>
        </messages>
    )
  }
}