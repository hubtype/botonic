import {
  isAllowedSize,
  getAttachmentType,
  getAcceptedFormats,
} from '../../src/message-utils'

describe('TEST: attachments ', () => {
  const createFile = ({ fakeData, fileName, mimeType, sizeInMB }) => {
    const file = new File([fakeData], fileName, { type: mimeType })
    if (sizeInMB) {
      // https://stackoverflow.com/a/55638956
      Object.defineProperty(file, 'size', {
        value: sizeInMB * 1024 * 1024,
        writable: false,
      })
    }
    return file
  }

  it('Gets correctly the attachment type', () => {
    const file = createFile({
      fakeData: 'video_data',
      fileName: 'video_filename.mp4',
      mimeType: 'video/mp4',
    })
    const sut = getAttachmentType(file.type)
    expect(sut).toEqual('video')
  })

  it('Accepts allowed files with size', () => {
    const file = createFile({
      fakeData: 'video_data',
      fileName: 'video_filename.mp4',
      mimeType: 'video/mp4',
      sizeInMB: 10,
    })
    const sut = isAllowedSize(file.size)
    expect(sut).toEqual(true)
  })

  it('Rejects large files', () => {
    const file = createFile({
      fakeData: 'video_data',
      fileName: 'video_filename.mp4',
      mimeType: 'video/mp4',
      sizeInMB: 15,
    })
    const sut = isAllowedSize(file.size)
    expect(sut).toEqual(false)
  })

  it('Returns a string (comma separated) with accepted mime types', () => {
    const sut = getAcceptedFormats()
    expect(sut).toEqual(
      'application/pdf,image/jpeg,image/png,video/mp4,video/quicktime,audio/mpeg,audio/mp3'
    )
  })
})
