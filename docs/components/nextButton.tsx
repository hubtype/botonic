import * as React from 'react'
import { withRouter } from 'react-router'

/*const Buttons = styled('div')`
  display: flex;
`*/


export const NextButton = withRouter(({ history, title, href }) => (
    <div style={{textAlign: 'right'}}>
      <a href={href}>
        Next ({title}) >
      </a>
    </div>
))