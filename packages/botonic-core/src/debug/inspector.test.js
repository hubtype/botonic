import { LogRouteInspector } from './inspector'

test('LogRouteInspector', () => {
  const sut = new LogRouteInspector()
  sut.routeMatched({ path: 'path1' }, 'k1', 'val1', 'inputVal')
})
