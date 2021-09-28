// @ts-nocheck
import { LogRouteInspector } from '../../src/debug'

test('LogRouteInspector', () => {
  const sut = new LogRouteInspector()
  sut.routeMatched({ path: 'path1' }, 'k1', 'val1', 'inputVal')
})
