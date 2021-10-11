import { Router } from '../../src'

describe('TEST: Get route by path', () => {
  const externalRoutes = [
    { path: '', action: 'Flow1.2' },
    { path: 'child', action: 'ChildAction' },
  ]
  const router = new Router([
    { path: 'initial', action: 'Initial' },
    {
      path: 'flow-1',
      action: 'Flow1',
      childRoutes: [
        {
          path: '1',
          action: 'Flow1.1',
          childRoutes: [
            { path: '1', action: 'Flow1.1.1' },
            { path: '2', action: 'Flow1.1.2' },
            { path: '3', action: 'Flow1.1.3' },
          ],
        },
        { path: '2', childRoutes: externalRoutes },
        {
          path: '3',
          action: 'Flow1.3',
          childRoutes: [
            { path: '1', action: 'Flow1.3.1' },
            { path: '2', action: 'Flow1.3.2' },
            { path: '3', action: 'Flow1.3.3' },
          ],
        },
      ],
    },
    { path: '404', action: '404Action' },
  ])

  it('path exists', () => {
    expect(router.getRouteByPath('initial')).toEqual({
      path: 'initial',
      action: 'Initial',
    })
    expect(router.getRouteByPath('flow-1/1')).toEqual({
      path: '1',
      action: 'Flow1.1',
      childRoutes: [
        { path: '1', action: 'Flow1.1.1' },
        { path: '2', action: 'Flow1.1.2' },
        { path: '3', action: 'Flow1.1.3' },
      ],
    })
    expect(router.getRouteByPath('flow-1/3/2')).toEqual({
      action: 'Flow1.3.2',
      path: '2',
    })
  })
  it('path exists in composed child routes', () => {
    expect(router.getRouteByPath('flow-1/2')).toEqual({
      path: '2',
      childRoutes: [
        { action: 'Flow1.2', path: '' },
        { action: 'ChildAction', path: 'child' },
      ],
    })
    expect(router.getRouteByPath('flow-1/2/child')).toEqual({
      path: 'child',
      action: 'ChildAction',
    })
  })
  it('path does not exist', () => {
    expect(router.getRouteByPath('')).toBeNull()
    expect(router.getRouteByPath('foo')).toBeNull()
    expect(router.getRouteByPath('flow-1/3/2/6')).toBeNull()
  })
})
