import { BotonicOutputParserTester } from '../helpers'

const tester = new BotonicOutputParserTester()
describe('Parsing Media responses', () => {
  it('TEST: Audio (+ Buttons)', () => {
    const botResponse = `
    
    <message typing="0" delay="0" role="audio-message" src="https://www.w3schools.com/html/horse.mp3" type="audio">
    </message>
    <message typing="0" delay="0" role="audio-message" src="https://www.w3schools.com/html/horse.mp3" type="audio">
        <button url="https://botonic.io">Visit Botonic</button>
    </message>
    `
    const expected = [
      {
        eventType: 'message',
        type: 'audio',
        delay: 0,
        typing: 0,
        buttons: [],
        src: 'https://www.w3schools.com/html/horse.mp3',
      },
      {
        eventType: 'message',
        type: 'audio',
        delay: 0,
        typing: 0,
        buttons: [{ title: 'Visit Botonic', url: 'https://botonic.io' }],
        src: 'https://www.w3schools.com/html/horse.mp3',
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })

  it('TEST: Image (+ Buttons)', () => {
    const botResponse = `
    <message typing="0" delay="0" role="image-message" src="https://media3.giphy.com/media/gtPaaCbkxpmWk/giphy.gif" type="image">
    </message>
    <message typing="0" delay="0" role="image-message" src="https://botonic.io/img/botonic-logo.png" type="image">
        <button url="https://botonic.io">Visit Botonic</button>
    </message>
      `
    const expected = [
      {
        eventType: 'message',
        type: 'image',
        delay: 0,
        typing: 0,
        buttons: [],
        src: 'https://media3.giphy.com/media/gtPaaCbkxpmWk/giphy.gif',
      },
      {
        eventType: 'message',
        type: 'image',
        delay: 0,
        typing: 0,
        buttons: [{ title: 'Visit Botonic', url: 'https://botonic.io' }],
        src: 'https://botonic.io/img/botonic-logo.png',
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })

  it('TEST: Document (+ Buttons)', () => {
    const botResponse = `
    <message typing="0" delay="0" role="document-message" src="http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf" type="document">
    </message>
    <message typing="0" delay="0" role="document-message" src="http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf" type="document">
        <button url="https://botonic.io">Visit Botonic</button>
    </message>
      `
    const expected = [
      {
        eventType: 'message',
        type: 'document',
        delay: 0,
        typing: 0,
        buttons: [],
        src: 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
      },
      {
        eventType: 'message',
        type: 'document',
        delay: 0,
        typing: 0,
        buttons: [{ title: 'Visit Botonic', url: 'https://botonic.io' }],
        src: 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })

  it('TEST: Video (+ Buttons)', () => {
    const botResponse = `
    <message typing="0" delay="0" role="video-message" src="https://www.w3schools.com/html/mov_bbb.mp4" type="video"></message>
    <message typing="0" delay="0" role="video-message" src="https://www.w3schools.com/html/mov_bbb.mp4" type="video">
        <button url="https://botonic.io">Visit Botonic</button>
    </message>
      `
    const expected = [
      {
        eventType: 'message',
        type: 'video',
        delay: 0,
        typing: 0,
        buttons: [],
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
      {
        eventType: 'message',
        type: 'video',
        delay: 0,
        typing: 0,
        buttons: [{ title: 'Visit Botonic', url: 'https://botonic.io' }],
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })
})
