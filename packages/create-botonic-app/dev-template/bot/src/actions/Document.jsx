import { Button, Document, Text } from '@botonic/react/src/experimental'
import React from 'react'
export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Documents</Text>
        <Document src='http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf' />
        <Document src='http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'>
          <Button url='https://botonic.io'>Visit Botonic</Button>
        </Document>
      </>
    )
  }
}
