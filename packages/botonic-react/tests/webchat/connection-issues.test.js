import { act } from 'react-test-renderer'

import { useNetwork } from '../../src/webchat/hooks'
import { renderCustomHook } from '../helpers/test-utils'

describe('TEST: connection issues in webchat', () => {
  it('Should be connected', () => {
    const { result } = renderCustomHook(useNetwork)
    act(() => {
      result.current.connect()
    })
    expect(result.current.isOnline).toBe(true)
  })
  it('Should be disconnected', () => {
    const { result } = renderCustomHook(useNetwork)
    act(() => {
      result.current.disconnect()
    })
    expect(result.current.isOnline).toBe(false)
  })
})
