import React from 'react'

export default class extends React.Component {

  static async getInitialProps({ req }) {

    /* This is how you fetch data from an API: */
    //const res = await fetch('https://api.example.com/movies')
    //const movies = await res.json()
    const movies = [
        {name: 'Pulp Fiction', desc: 'Le Big Mac', url: 'https://www.imdb.com/title/tt0110912', pic: 'https://ia.media-imdb.com/images/M/MV5BMTkxMTA5OTAzMl5BMl5BanBnXkFtZTgwNjA5MDc3NjE@._V1_SY1000_CR0,0,673,1000_AL_.jpg'},
        {name: 'The Big Lebowski', desc: 'Fuck it Dude', url: 'https://www.imdb.com/title/tt0118715', pic: 'https://ia.media-imdb.com/images/M/MV5BZTFjMjBiYzItNzU5YS00MjdiLWJkOTktNDQ3MTE3ZjY2YTY5XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SY1000_CR0,0,665,1000_AL_.jpg'},
        {name: 'Snatch', desc: 'Five minutes, Turkish', url: 'https://www.imdb.com/title/tt0208092', pic: 'https://ia.media-imdb.com/images/M/MV5BMTA2NDYxOGYtYjU1Mi00Y2QzLTgxMTQtMWI1MGI0ZGQ5MmU4XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SY1000_SX684_AL_.jpg'},
    ]
    return { movies }
  }

  render() {
    return (
        <messages>
            <message type="text">
                Great! Here we can see a carrousel. It's a Facebook Messenger component, and it's a
                group of elements which consists of an image, a title, a subtitle and a group of buttons.
                You can get more information here: https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic?locale=en_US#carousel
            </message>
            <message type="carrousel">
                {this.props.movies.map((e, i) => 
                    <element key={e.name}>
                        <image>{e.pic}</image>
                        <title>{e.name}</title>
                        <desc>{e.desc}</desc>
                        <button url={e.url}>Visit website</button>
                    </element>
                )}
            </message>
            <message type="text">
                Now, we are going to end this tutorial, please type '!end'.
            </message>
        </messages>
    )
  }
}