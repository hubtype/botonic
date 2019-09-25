import * as React from 'react'
import { withRouter } from 'react-router'

/*const Buttons = styled('div')`
  display: flex;
`*/


export const PrevButton = withRouter(({ history, title, href }) => {
  console.log(history)
return (
  <div style={{textAlign: 'left'}}>
    <a href={href} >
    &lt; Previous ({title}) 
    </a>
    
  </div>

)
})