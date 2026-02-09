/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: MessageTemplate is a component that renders a message template */
import { renderComponent } from '../util/react'

export const MessageTemplate = props => {
  const renderBrowser = () => null
  const renderNode = () => (
    <message type='template'>
      <pre
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.payload) }}
      />
    </message>
  )
  return renderComponent({ renderBrowser, renderNode })
}
