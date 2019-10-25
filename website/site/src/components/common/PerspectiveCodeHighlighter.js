import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

const PerspectiveCodeHighlighter = ({ codeString }) => {
  const PerspectiveContainer = styled.div`
    transform: rotate3d(0, 1, 0, -10deg);
    min-width: 538px;
    min-height: 400px;
    position: absolute;
    background: linear-gradient(180deg, #4d546c 0%, rgba(77, 84, 108, 0) 100%);
  `

  return (
    <PerspectiveContainer>
      <SyntaxHighlighter
        language="jsx"
        style={tomorrow}
        customStyle={{
          background: "transparent",
          fontFamily: "Palinquin",
          fontSize: "13px",
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </PerspectiveContainer>
  )
}
PerspectiveCodeHighlighter.propTypes = {
  codeString: PropTypes.string,
}

PerspectiveCodeHighlighter.defaultProps = {
  codeString: "",
}

export default PerspectiveCodeHighlighter
