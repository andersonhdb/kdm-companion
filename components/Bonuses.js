import React from 'react'
import { View, Text, Row, Title, Subtitle, ListView } from '@shoutem/ui'
import { kea } from 'kea'
import PropTypes from 'prop-types'
import { constants } from '../src/reducers'
import colors from '../src/colors'
import { locationLogic } from './Locations'
import R from 'ramda'

class Bonuses extends React.Component {
  _header() {
    return <Title>Bonuses</Title>
  }

  _row(item) {
    let text = item.items.map(e => (
      <Text key={e.key} style={styles.bonusText}>
        {e.text}
      </Text>
    ))
    return (
      <View key={item.key} style={styles.bonus}>
        <Subtitle>{item.title}</Subtitle>
        {text}
      </View>
    )
  }

  render() {
    return (
      <ListView
        data={this.props.data}
        renderRow={this._row}
        renderHeader={this._header}
        autoHideHeader={false}
      />
    )
  }
}

Bonuses.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          text: PropTypes.string,
        })
      ),
    })
  ).isRequired,
}

const connectedBonuses = kea({
  path: () => ['scenes', 'bonuses'],
  reducers: ({ actions }) => ({
    bonuses: [
      {},
      PropTypes.object,
      {
        [constants.ADD_DATA]: (state, payload) => {
          return Object.assign({}, state, payload.bonuses)
        },
        [constants.REMOVE_DATA]: (state, payload) => {
          let next = Object.assign({}, state)
          Object.keys(payload.bonuses || {}).forEach(key => delete next[key])
          return next
        },
      },
    ],
  }),
  selectors: ({ selectors }) => ({
    data: [
      () => [selectors.bonuses],
      bonuses => {
        const bonusesList = Array.from(Object.entries(bonuses), v => ({
          id: v[0],
          name: v[1].name,
          description: v[1].description,
        }))

        const elements = bonusesList.map(bonus => {
          let items = bonus.description.map((text, index) => {
            let key = `${bonus.id}-${index}`
            return { key, text }
          })
          return { key: bonus.id, title: bonus.name, items }
        })

        return elements
      },
      PropTypes.object,
    ],
  }),
})(Bonuses)

const styles = {
  bonusText: {
    color: colors.grey500,
  },
  bonus: {
    paddingVertical: 3,
  },
}

export default connectedBonuses
