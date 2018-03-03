import React from 'react'
import { Screen, Divider, Title, Text } from '@shoutem/ui'
import Settlements from '../components/Settlements'
import { kea, connect } from 'kea'
import PropTypes from 'prop-types'

export default class SettlementsScreen extends React.Component {
  render() {
    return (
      <Screen style={{ paddingTop: 5, paddingLeft: 5 }}>
        <Settlements navigation={this.props.navigation} />
      </Screen>
    )
  }
}
