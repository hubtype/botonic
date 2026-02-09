/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: ShareButton is a component that renders a share button */
import { renderComponent } from '../util/react'

export const ShareButton = props => {
  const renderBrowser = () => null
  const renderNode = () => (
    <button type='element_share'>
      <pre
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.payload) }}
      />
    </button>
  )

  return renderComponent({ renderBrowser, renderNode })
}
