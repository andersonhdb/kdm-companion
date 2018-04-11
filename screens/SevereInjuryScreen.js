import React from 'react'
import { Screen } from '@shoutem/ui'
import SevereInjuryTable from '../components/SevereInjuryTable'

export default class SevereInjuryScreen extends React.Component {
  render() {
    return (
      <Screen
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          paddingHorizontal: 5,
        }}
      >
        <SevereInjuryTable />
      </Screen>
    )
  }
}
