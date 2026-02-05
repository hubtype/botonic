/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: ShareButton is a component that renders a share button */
import { renderComponent } from '../util/react'

export const ShareButton = props => {
  const renderBrowser = () => null
  const renderNode = () => (
    // biome-ignore lint/a11y/useButtonType: ShareButton is a component that renders a share button
    <button type='element_share'>
      <pre
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.payload) }}
      />
    </button>
  )

  return renderComponent({ renderBrowser, renderNode })
}
