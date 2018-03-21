import React from 'react'
import { Platform, StatusBar } from 'react-native'
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation'
import TabBar from './TabBar'
import { Image } from '@shoutem/ui'
import Expo from 'expo'
import colors from '../src/colors'
import { observer, inject } from 'mobx-react/native'
import Header from './Header'

//tmp
import BlankScreen from '../screens/BlankScreen'

// Campaign
import SettlementsScreen from '../screens/SettlementsScreen'
import ExpansionsScreen from '../screens/ExpansionsScreen'

// Settlement
import SummaryScreen from '../screens/SummaryScreen'
import BonusesScreen from '../screens/BonusesScreen'
import EndeavorsScreen from '../screens/EndeavorsScreen'
import ResourcesScreen from '../screens/ResourcesScreen'

// Hunt
import HuntScreen from '../screens/HuntScreen'

// Showdown
import TerrainScreen from '../screens/TerrainScreen'
import FightScreen from '../screens/FightScreen'
import ResultScreen from '../screens/ResultScreen'

const styles = {
  tabBar: {
    backgroundColor: colors.grey900,
    height: 35,
  },
  tab: {
    height: 30,
  },
}

const ShowdownNavigator = TabNavigator(
  {
    Setup: {
      screen: BlankScreen, //TerrainScreen,
      navigationOptions: {
        tabBarLabel: 'Setup',
      },
    },
    Fight: {
      screen: BlankScreen, //FightScreen,
      navigationOptions: {
        tabBarLabel: 'Fight',
      },
    },
    Result: {
      screen: BlankScreen, //ResultScreen,
      navigationOptions: {
        tabBarLabel: 'Result',
      },
    },
  },
  {
    tabBarPosition: 'top',
    animationEnabled: true,
    swipeEnabled: true,
    lazy: false,
    tabBarOptions: {
      upperCaseLabel: false,
      activeTintColor: colors.grey50,
      inactiveTintColor: colors.grey50,
      style: styles.tabBar,
      tabStyle: styles.tab,
    },
  }
)

const SettlementNavigator = TabNavigator(
  {
    Summary: {
      screen: SummaryScreen,
    },
    Bonuses: {
      screen: BonusesScreen,
    },
    Endeavors: {
      screen: EndeavorsScreen,
    },
    Resources: {
      screen: ResourcesScreen,
    },
  },
  {
    tabBarPosition: 'top',
    animationEnabled: true,
    swipeEnabled: true,
    lazy: false,
    tabBarOptions: {
      showIcon: false,
      upperCaseLabel: false,
      activeTintColor: colors.grey50,
      inactiveTintColor: colors.grey50,
      style: styles.tabBar,
      tabStyle: styles.tab,
    },
  }
)

const CampaignNavigator = TabNavigator(
  {
    Settlements: {
      screen: SettlementsScreen,
      navigationOptions: {
        title: 'Settlement Admin',
      },
    },
    Expansions: {
      screen: ExpansionsScreen,
      navigationOptions: {
        title: 'Expansions',
      },
    },
  },
  {
    tabBarPosition: 'top',
    animationEnabled: true,
    swipeEnabled: true,
    lazy: true,
    tabBarOptions: {
      showIcon: false,
      upperCaseLabel: false,
      activeTintColor: colors.grey50,
      inactiveTintColor: colors.grey50,
      style: styles.tabBar,
      tabStyle: styles.tab,
    },
  }
)

const MainNavigator = TabNavigator(
  {
    // Campaign: {
    //   screen: CampaignNavigator,
    //   navigationOptions: {
    //     tabBarLabel: 'Campaign',
    //     tabBarIcon: icon(require('../images/icon_lantern.png')),
    //   },
    // },
    Survivors: {
      screen: BlankScreen,
      navigationOptions: {
        tabBarLabel: 'Survivors',
        tabBarIcon: icon(require('../images/icon_survivors.png')),
      },
    },
    Settlement: {
      screen: SettlementNavigator,
      navigationOptions: {
        tabBarLabel: 'Settlement',
        tabBarIcon: icon(require('../images/icon_settlement.png')),
      },
    },
    Hunt: {
      screen: HuntScreen, //HuntScreen,
      navigationOptions: {
        tabBarLabel: 'Hunt',
        tabBarIcon: icon(require('../images/icon_hunt.png')),
      },
    },
    Showdown: {
      screen: ShowdownNavigator,
      navigationOptions: {
        tabBarLabel: 'Showdown',
        tabBarIcon: icon(require('../images/icon_monster.png')),
      },
    },
  },
  {
    initialRouteName: 'Settlement',
    tabBarPosition: 'bottom',
    animationEnabled: false, //Platform.OS === 'android' ? false : true,
    swipeEnabled: false,
    lazy: true,
    tabBarComponent: TabBar,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      upperCaseLabel: false,
      activeTintColor: colors.grey50,
      inactiveTintColor: colors.grey600,
      indicatorStyle: {
        backgroundColor: 'transparent',
      },
      iconStyle: {
        width: 40,
        height: 40,
        bottom: -10,
      },
      style: {
        backgroundColor: colors.grey900,
        height: 75,
      },
      tabStyle: {
        paddingHorizontal: 0,
      },
    },
  }
)

const MainNavigatorHeader = StackNavigator(
  {
    Main: {
      screen: MainNavigator,
    },
    Campaign: {
      screen: CampaignNavigator,
    },
  },
  {
    cardStyle: {
      backgroundColor: colors.black,
    },
    navigationOptions: ({ navigation }) => ({
      header: <Header navigation={navigation} />,
    }),
  }
)

function icon(image) {
  return ({ focused }) => {
    let opacity = focused ? 0.7 : 0.4
    return (
      <Image
        source={image}
        style={{
          width: 40,
          height: 40,
        }}
        resizeMode="contain"
        tintColor={colors.grey400}
        opacity={opacity}
      />
    )
  }
}

export default MainNavigatorHeader
// export default SettlementNavigator
