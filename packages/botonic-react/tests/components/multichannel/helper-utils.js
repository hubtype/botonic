import { withContext } from '../../helpers/react-traverser'
import TestRenderer from 'react-test-renderer'

export const whatsappRenderer = sut =>
  TestRenderer.create(
    withContext(sut, { session: { user: { provider: 'whatsappnew' } } })
  )
