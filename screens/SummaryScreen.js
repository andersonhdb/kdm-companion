import React from 'react'
import {
  Screen,
  View,
  Button,
  Image,
  Divider,
  Title,
  Text,
  Row,
  Icon,
} from '@shoutem/ui'
import Modal from 'react-native-modal'
import colors from '../src/colors'

import Innovations from '../components/Innovations'
import Locations from '../components/Locations'
import Principles from '../components/Principles'

class SummaryScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Summary',
  }

  state = {
    locationsVisible: false,
    innovationsVisible: false,
    principlesVisible: false,
  }

  render() {
    return (
      <Screen>
        <Button
          styleName="textual"
          style={{ alignSelf: 'flex-start' }}
          onPress={() => this.setState({ locationsVisible: true })}
        >
          <Title>Locations</Title>
          <Icon name="right-arrow" />
        </Button>
        <Text>Lantern Hoard</Text>
        <Text>Skinnery</Text>

        <Modal
          isVisible={this.state.locationsVisible}
          onBackdropPress={() => this.setState({ locationsVisible: false })}
          onBackButtonPress={() => this.setState({ locationsVisible: false })}
          useNativeDriver={true}
          backdropColor={colors.black}
        >
          <View
            style={{
              backgroundColor: colors.grey900,
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          >
            <Locations />
            <Divider />
            <Button onPress={() => this.setState({ locationsVisible: false })}>
              <Text>Close</Text>
            </Button>
          </View>
        </Modal>

        <Divider />

        <Button
          styleName="textual"
          style={{ alignSelf: 'flex-start' }}
          onPress={() => this.setState({ innovationsVisible: true })}
        >
          <Title>Innovations</Title>
          <Icon name="right-arrow" />
        </Button>
        <Text>Language</Text>
        <Text>Drums</Text>

        <Modal
          isVisible={this.state.innovationsVisible}
          onBackdropPress={() => this.setState({ innovationsVisible: false })}
          onBackButtonPress={() => this.setState({ innovationsVisible: false })}
          useNativeDriver={true}
          backdropColor={colors.black}
        >
          <View
            style={{
              backgroundColor: colors.grey900,
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          >
            <Innovations />
            <Divider />
            <Button
              onPress={() => this.setState({ innovationsVisible: false })}
            >
              <Text>Close</Text>
            </Button>
          </View>
        </Modal>

        <Divider />

        <Button
          styleName="textual"
          style={{ alignSelf: 'flex-start' }}
          onPress={() => this.setState({ principlesVisible: true })}
        >
          <Title>Principles</Title>
          <Icon name="right-arrow" />
        </Button>
        <Text>Graves</Text>
        <Text>Survival of the fittest</Text>

        <Modal
          isVisible={this.state.principlesVisible}
          onBackdropPress={() => this.setState({ principlesVisible: false })}
          onBackButtonPress={() => this.setState({ principlesVisible: false })}
          useNativeDriver={true}
          backdropColor={colors.black}
        >
          <View style={{ backgroundColor: colors.grey900 }}>
            <Principles />
            <Divider />
            <Button onPress={() => this.setState({ principlesVisible: false })}>
              <Text>Close</Text>
            </Button>
          </View>
        </Modal>

        <Divider />

        <Title>Survival Limit: 2</Title>
      </Screen>
    )
  }
}

export default SummaryScreen
