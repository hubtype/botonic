import React, { Component, Fragment } from 'react'
import GoogleMap from 'google-map-react'
import styled from 'styled-components'

class Location extends Component {
  constructor(props) {
    super(props)

    this.state = {
      center: {
        lat: 41.3849491,
        lng: 2.1723708
      },
      places: [
        {
          id: 'hubtype',
          name: 'hubtype',
          lat: 41.402449,
          lng: 2.1921293
        }
      ]
    }
  }
  render() {
    const { places } = this.state

    return (
      <Fragment>
        <GoogleMap
          defaultZoom={10}
          defaultCenter={this.state.center}
          bootstrapURLKeys={{
            key: 'AIzaSyDkMEfW7VXVlWMi1NStIgNDPqrhlsZrNrk'
          }}
          yesIWantToUseGoogleMapApiInternals
        >
          {places.map(place => (
            <Marker
              key={place.id}
              text={place.name}
              lat={place.lat}
              lng={place.lng}
            />
          ))}
        </GoogleMap>
      </Fragment>
    )
  }
}
const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: blue;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`

const Marker = props => <Wrapper />

export default Location
