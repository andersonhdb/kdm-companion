import React from 'react'
import { Screen, View, Text, Image, Button, Row } from '@shoutem/ui'

import MonsterSelector from '../components/MonsterSelector'
import Terrain from '../components/Terrain'
import Ai from '../components/Ai'

export default class TerrainScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Terrain',
  }

  render() {
    return (
      <Screen style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MonsterSelector />
          <Terrain />
          <Ai />
        </View>
      </Screen>
    )
  }
}
