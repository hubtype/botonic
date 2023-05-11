import {
  getFullMimeWhitelist,
  getMediaType,
  isAllowedSize,
} from '../../lib/cjs/message-utils'
import { toMB } from '../helpers/test-utils'

describe('TEST: attachments', () => {
  it('Gets correctly the attachment type', () => {
    const mimeType = 'video/mp4'
    const sut = getMediaType(mimeType)
    expect(sut).toEqual('video')
  })

  it('Accepts allowed files with size', () => {
    const size = toMB(10)
    const sut = isAllowedSize(size)
    expect(sut).toEqual(true)
  })

  it('Rejects large files', () => {
    const size = toMB(15)
    const sut = isAllowedSize(size)
    expect(sut).toEqual(false)
  })

  it('Returns a string (comma separated) with accepted mime types', () => {
    const sut = getFullMimeWhitelist().join(',')
    expect(sut).toEqual(
      'audio/mpeg,audio/mp3,application/pdf,image/jpeg,image/png,video/mp4,video/quicktime'
    )
  })
})
