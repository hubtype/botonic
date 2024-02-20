import { testManageEnvironment } from './manage-contentful.helper'

describe('ManageEnvironment', () => {
  test('TEST: environments', async () => {
    const environmentManager = testManageEnvironment()

    const environments = await environmentManager.environments

    expect(environments.items[0].name).toEqual('master')
    expect(environments.items[1].name).toEqual('manage-contentful')
  })

  test.each([['master'], ['manage-contentful']])(
    'TEST: get environment %s',
    async (environmentName: string) => {
      const environmentManager = testManageEnvironment()

      const environment =
        await environmentManager.getEnvironment(environmentName)

      expect(environment.name).toEqual(environmentName)
    }
  )

  test('TEST: create and delete environment', async () => {
    const environmentManager = testManageEnvironment()
    const newEnvironment = 'newEnvironment'

    try {
      const environment =
        await environmentManager.createEnvironmentWithId(newEnvironment)
      const environments = await environmentManager.getEnvironments()
      expect(environment.name).toEqual(newEnvironment)
      expect(environments.items.length).toBe(3)
      expect(environments.items[0].name).toEqual('master')
      expect(environments.items[1].name).toEqual('manage-contentful')
      expect(environments.items[2].name).toEqual(newEnvironment)
    } finally {
      await environmentManager.deleteEnvironment(newEnvironment)
      const environments = await environmentManager.getEnvironments()
      expect(environments.items.length).toBe(2)
      expect(environments.items[0].name).toEqual('master')
      expect(environments.items[1].name).toEqual('manage-contentful')
    }
  })
})
