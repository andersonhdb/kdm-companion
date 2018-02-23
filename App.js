import React from 'react'
import { Platform } from 'react-native'
import Expo, { AppLoading } from 'expo'
import { Provider } from 'react-redux'
import store from './src/store'

import Navigator from './components/Navigator'

export default class App extends React.Component {
  state = {
    isReady: false,
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }

    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    )
  }

  async _cacheResourcesAsync() {
    let images = []
    // menu images for ios
    if (Platform.OS === 'ios') {
      images = images.concat([
        // require('./images/build.png'),
        // require('./images/resources.jpg'),
        // require('./images/settlement.jpg'),
      ])
    }

    await Promise.all([
      Expo.Font.loadAsync({
        'rubicon-icon-font': require('@shoutem/ui/fonts/rubicon-icon-font.ttf'),
        'Rubik-Black': require('@shoutem/ui/fonts/Rubik-Black.ttf'),
        'Rubik-BlackItalic': require('@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
        'Rubik-Bold': require('@shoutem/ui/fonts/Rubik-Bold.ttf'),
        'Rubik-BoldItalic': require('@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
        'Rubik-Italic': require('@shoutem/ui/fonts/Rubik-Italic.ttf'),
        'Rubik-Light': require('@shoutem/ui/fonts/Rubik-Light.ttf'),
        'Rubik-LightItalic': require('@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
        'Rubik-Medium': require('@shoutem/ui/fonts/Rubik-Medium.ttf'),
        'Rubik-MediumItalic': require('@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
        'Rubik-Regular': require('@shoutem/ui/fonts/Rubik-Regular.ttf'),
      }),
      cacheImages(images),
    ])
  }
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Expo.Image.prefetch(image)
    } else {
      return Expo.Asset.fromModule(image).downloadAsync()
    }
  })
}
