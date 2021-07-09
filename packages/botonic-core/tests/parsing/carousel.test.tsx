import { BotonicOutputParserTester } from '../helpers'

const tester = new BotonicOutputParserTester()
describe('Parsing Carousel responses', () => {
  it('TEST: Carousel', () => {
    const botResponse = `
    <message typing="0" delay="0" style="width:85%;padding:0;background-color:rgba(0, 0, 0, 0)" type="carousel">
        <element>
            <pic>https://images-na.ssl-images-amazon.com/images/I/51Z95XQDHRL._SY445_.jpg</pic>
            <title>Pulp Fiction</title>
            <desc>Le Big Mac</desc>
            <button url="https://www.imdb.com/title/tt0110912">Visit website</button>
        </element>
        <element>
            <pic>https://upload.wikimedia.org/wikipedia/en/a/a7/Snatch_ver4.jpg</pic>
            <title>The Big Lebowski</title>
            <desc>Fuck it Dude</desc>
            <button url="https://www.imdb.com/title/tt0118715">Visit website</button>
        </element>
        <element>
            <pic>http://www.libertytuga.pt/wp-content/uploads/2011/11/snatch.jpg</pic>
            <title>Snatch</title>
            <desc>Five minutes, Turkish</desc>
            <button url="https://www.imdb.com/title/tt0208092">Visit website</button>
        </element>
    </message>
    `
    const expected = [
      {
        eventType: 'message',
        type: 'carousel',
        delay: 0,
        typing: 0,
        elements: [
          {
            pic:
              'https://images-na.ssl-images-amazon.com/images/I/51Z95XQDHRL._SY445_.jpg',
            title: 'Pulp Fiction',
            subtitle: 'Le Big Mac',
            buttons: [
              {
                title: 'Visit website',
                url: 'https://www.imdb.com/title/tt0110912',
              },
            ],
          },
          {
            pic:
              'https://upload.wikimedia.org/wikipedia/en/a/a7/Snatch_ver4.jpg',
            title: 'The Big Lebowski',
            subtitle: 'Fuck it Dude',
            buttons: [
              {
                title: 'Visit website',
                url: 'https://www.imdb.com/title/tt0118715',
              },
            ],
          },
          {
            pic:
              'http://www.libertytuga.pt/wp-content/uploads/2011/11/snatch.jpg',
            title: 'Snatch',
            subtitle: 'Five minutes, Turkish',
            buttons: [
              {
                title: 'Visit website',
                url: 'https://www.imdb.com/title/tt0208092',
              },
            ],
          },
        ],
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })
})
