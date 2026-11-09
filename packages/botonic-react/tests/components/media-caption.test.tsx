import { describe, expect, test } from '@jest/globals'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Audio } from '../../src/components/audio'
import { Document } from '../../src/components/document'
import { Image } from '../../src/components/image'
import {
  serializeMedia,
  withMediaCaption,
} from '../../src/components/media-caption'
import { Video } from '../../src/components/video'

const MEDIA_URL = 'https://example.com/asset'

describe('serializeMedia', () => {
  test.each([
    ['image', 'image'],
    ['audio', 'audio'],
    ['video', 'video'],
    ['document', 'document'],
  ] as const)('includes caption when set for %s', (field, key) => {
    expect(serializeMedia(field, { src: MEDIA_URL, caption: 'Hola' })).toEqual({
      [key]: MEDIA_URL,
      caption: 'Hola',
    })
  })

  test('omits caption key when absent', () => {
    expect(serializeMedia('image', { src: MEDIA_URL })).toEqual({
      image: MEDIA_URL,
    })
  })
})

describe('withMediaCaption', () => {
  test('renders caption after media content', () => {
    const html = renderToStaticMarkup(
      withMediaCaption(
        <img alt='media' src='/file.png' />,
        'Texto debajo'
      ) as ReactElement
    )
    const mediaIndex = html.indexOf('file.png')
    const captionIndex = html.indexOf('Texto debajo')
    expect(mediaIndex).toBeGreaterThan(-1)
    expect(captionIndex).toBeGreaterThan(mediaIndex)
  })

  test('returns content unchanged when caption is missing', () => {
    const media = <span id='only-media'>media</span>
    expect(withMediaCaption(media)).toEqual(media)
  })
})

describe.each([
  ['Image', Image, Image.serialize],
  ['Audio', Audio, Audio.serialize],
  ['Video', Video, Video.serialize],
  ['Document', Document, Document.serialize],
] as const)('%s caption', (name, Component, serialize) => {
  test('renders caption inside the message node', () => {
    const html = renderToStaticMarkup(
      <Component src={MEDIA_URL} caption='Agent note' />
    )
    expect(html).toContain('Agent note')
    expect(html).not.toContain('caption=')
  })

  test('does not render caption block when omitted', () => {
    const html = renderToStaticMarkup(<Component src={MEDIA_URL} />)
    expect(html).not.toContain('Agent note')
  })

  test('serialize persists caption for session rehydration', () => {
    expect(serialize({ src: MEDIA_URL, caption: 'Persisted' })).toEqual({
      [name.toLowerCase()]: MEDIA_URL,
      caption: 'Persisted',
    })
  })
})
