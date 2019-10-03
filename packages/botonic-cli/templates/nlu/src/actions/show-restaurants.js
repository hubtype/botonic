import React from 'react'
import { RequestContext, Text } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit({ input, session, lastRoutePath }) {
    const getNotUndefinedCustomEntities = (entities, tag) =>
      entities.tags.length
        ? entities.tags.filter(e => e.tags.includes(tag)).map(res => res.value)
        : undefined

    let namedEntitiesPlace = input.entities.places.length
      ? input.entities.places
      : undefined

    let customEntitiesRestaurants = getNotUndefinedCustomEntities(
      input.entities,
      'Restaurant'
    )
    return { namedEntitiesPlace, customEntitiesRestaurants }
  }

  render() {
    if (
      this.props.customEntitiesRestaurants &&
      this.props.customEntitiesRestaurants.length
    ) {
      return (
        <>
          <Text>
            For sure! So you want to make a reservation at{' '}
            {this.props.customEntitiesRestaurants}
          </Text>
          <Text>Now you can ask me how to reach it!</Text>
        </>
      )
    } else if (
      this.props.namedEntitiesPlace &&
      this.props.namedEntitiesPlace.length
    ) {
      return (
        <>
          <Text>
            Okay! So you want to make a reservation close to{' '}
            {this.props.namedEntitiesPlace[0]}
          </Text>
          <Text>Now you can ask me how to reach it!</Text>
        </>
      )
    } else {
      return (
        <>
          <Text>Sorry, I have not found any restaurant!</Text>
          <Text>
            You can try to include some of these restaurants in your query:
            "Eggy's", "Delicatessen", "Joan's", "Seven-Hills"
          </Text>
          <Text>
            Additionally, you can ask me for a restaurant near "Times Square"
          </Text>
        </>
      )
    }
  }
}
