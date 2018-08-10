import { types } from 'mobx-state-tree'
import { Monster } from './Monster'
import { Expansion } from './Expansion'
import { capitalize } from '../utils'

const Resource = types
  .model('Resource', {
    id: types.identifier,
    // name: types.string,
    monster: types.maybeNull(types.reference(Monster)),
    type: types.maybeNull(
      types.enumeration('Type', ['basic', 'strange', 'vermin', 'endeavor'])
    ),
    expansion: types.optional(types.reference(Expansion), 'core'),
    keywords: types.maybeNull(types.array(types.string)),
  })
  .views(self => ({
    get name() {
      return capitalize(self.id)
    },
    get section_id() {
      let id = null
      if (self.monster) {
        id = self.monster.id
      } else if (self.type) {
        id = self.type
      }
      return id
    },
  }))

export { Resource }
