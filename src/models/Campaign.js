import { types, getSnapshot, getRoot, resolveIdentifier } from 'mobx-state-tree'
import { keys, values } from 'mobx'
import { SettlementLocation } from './SettlementLocation'
import { Innovation } from './Innovation'
import { Resource } from './Resource'
import { Settlement, init as newSettlementData } from './Settlement'
import { Expansion } from './Expansion'
import { Principle } from './Principle'
import { Monster } from './Monster'
import { CampaignType } from './CampaignType'

import R from 'ramda'

import { expansionFilter, uuid } from '../utils'

const StoredResource = types.model('StoredResource', {
  id: types.identifier,
  resource: types.reference(Resource),
  quantity: 0,
})

const SelectedMonsterLevel = types.model('SelectedMonsterLevel', {
  monster: types.reference(Monster),
  level: types.string,
})

export const Campaign = types
  .model('Campaign', {
    id: types.optional(types.identifier, () => uuid()),
    settlement: types.optional(Settlement, newSettlementData),
    locations: types.map(types.reference(SettlementLocation)),
    innovations: types.map(types.reference(Innovation)),
    principles: types.optional(
      types.model('Principles', {
        death: types.maybeNull(types.reference(Principle)),
        newlife: types.maybeNull(types.reference(Principle)),
        society: types.maybeNull(types.reference(Principle)),
        conviction: types.maybeNull(types.reference(Principle)),
      }),
      {}
    ),
    stored_resources: types.map(StoredResource),
    expansions: types.optional(types.map(types.reference(Expansion)), {
      core: 'core',
    }),
    hunting: types.maybeNull(SelectedMonsterLevel),
    showdown: types.maybeNull(SelectedMonsterLevel),
    notes: '',
    type: types.optional(types.reference(CampaignType), 'potl'),
  })
  .actions(self => ({
    selectLocation(location) {
      if (self.locations.has(location.id)) {
        self.locations.delete(location.id)
      } else {
        self.locations.set(location.id, location.id)
      }
    },
    selectInnovation(innovation) {
      if (self.innovations.has(innovation.id)) {
        // process extensions
        let inno = self.innovations.get(innovation.id)
        if (inno.settlement) {
          self.settlement.remove(getSnapshot(inno.settlement))
        }

        self.innovations.delete(innovation.id)
      } else {
        self.innovations.set(innovation.id, innovation.id)

        // process extensions
        let inno = self.innovations.get(innovation.id)
        if (inno.settlement) {
          self.settlement.add(getSnapshot(inno.settlement))
        }
      }
    },
    selectExpansion(expansion) {
      if (expansion.id === 'core') {
        // don't allow to remove core expansion.
        return
      }
      if (self.expansions.has(expansion.id)) {
        // reset some stuff when expansions are removed
        self.hunting = null
        self.showdown = null

        // remove all expansion locations
        let remove = []
        for (let [id, item] of self.locations) {
          if (item.expansion.id === expansion.id) {
            remove.push({ id })
          }
        }
        remove.forEach(item => self.selectLocation(item))

        // remove all expansion innovations
        remove = []
        for (let [id, item] of self.innovations) {
          if (item.expansion.id === expansion.id) {
            remove.push({ id })
          }
        }
        remove.forEach(item => self.selectInnovation(item))

        // remove all expansion monster resources
        for (let [id, item] of self.stored_resources) {
          if (
            (item.resource.expansion &&
              item.resource.expansion !== 'core' &&
              item.resource.expansion.id === expansion.id) ||
            (item.resource.monster &&
              item.resource.monster.expansion.id === expansion.id)
          ) {
            item.quantity = 0
          }
        }

        self.expansions.delete(expansion.id)
      } else {
        self.expansions.set(expansion.id, expansion.id)
      }
    },
    selectPrinciple(type, principle) {
      if (self.principles[type]) {
        let principle = self.principles[type]
        if (principle.settlement) {
          self.settlement.remove(getSnapshot(principle.settlement))
        }
      }

      // selecting
      self.principles[type] = principle.id

      // process extensions
      let prin = self.principles[type]
      if (prin) {
        //handle unselected principle
        if (prin.settlement) {
          self.settlement.add(getSnapshot(prin.settlement))
        }
      }
    },
    setResourceCount(resource, count) {
      if (self.stored_resources.get(resource.id)) {
        self.stored_resources.get(resource.id).quantity = count
      } else {
        // create a new entry
        self.stored_resources.put({
          id: resource.id,
          resource: resource.id,
          quantity: count,
        })
      }
    },
    selectHunt(monster) {
      if (monster.monster_id) {
        self.hunting = { monster: monster.monster_id, level: monster.level_id }
        self.showdown = { monster: monster.monster_id, level: monster.level_id } // default showdown to hunted monster
      } else {
        self.hunting = null
      }
    },
    selectShowdown(monster) {
      if (monster.monster_id) {
        self.showdown = { monster: monster.monster_id, level: monster.level_id }
      } else {
        self.showdown = null
      }
    },
    saveNotes(notes) {
      self.notes = notes
    },
    setCampaignType(type) {
      self.type = type
      switch (type) {
        case 'pots':
          if (!self.expansions.get('dk')) {
            self.expansions.set('dk', 'dk')
          }
          break
      }
    },
    updateName(name) {
      self.settlement.updateName(name)
    },
  }))
  .views(self => ({
    get name() {
      return self.settlement.name
    },
    get huntingMonsterLevel() {
      return self.hunting
        ? self.hunting.monster.levels.get(self.hunting.level)
        : null
    },
    get showdownMonsterLevel() {
      return self.showdown
        ? self.showdown.monster.levels.get(self.showdown.level)
        : null
    },
    get expansionList() {
      return keys(self.expansions)
    },
    // Returns items from the map that are in the expansionList of this campaign
    selectedExpansionFilter(map) {
      return R.filter(
        item => {
          let include = false
          if (item.expansion) {
            include = self.expansionList.includes(item.expansion.id)
          } else {
            include = true
          }
          if (include && item.campaign) {
            include = item.campaign.id === self.type.id
          }
          return include
        },
        map.get //is it a real map?
          ? values(map)
          : map
      )
    },
    // gets selected innovations validated with selected expansions
    // TODO: do we need to do this since we are removing innovations when removing campaign.
    get innovationsList() {
      return self.selectedExpansionFilter(self.innovations)
    },
    // gets selected locations validated with selected expansions
    // TODO: do we need to do this since we are removing locations when removing campaign.
    get locationsList() {
      return self.selectedExpansionFilter(self.locations)
    },
    // Returns all content being used by an expansion
    expansionContent(expansion) {
      let locations = expansionFilter(self.locations, expansion)
      let innovations = expansionFilter(self.innovations, expansion)
      let resources = R.filter(
        item =>
          ((item.resource.expansion &&
            item.resource.expansion.id === expansion.id) ||
            (item.resource.monster &&
              item.resource.monster.expansion.id === expansion.id)) &&
          item.quantity > 0,
        values(self.stored_resources)
      )
      let length = 0 + locations.length + innovations.length + resources.length

      return { locations, innovations, resources, length }
    },
    get hasSOTF() {
      return self.principles.newlife && self.principles.newlife.id === 'sotf'
    },
    get courageMilestones() {
      if (self.type === 'pots') {
        return {
          3: { description: '![book](book) Awake (DK p.11)' },
          9: { description: '![book](book) See the Truth (p.167)' },
        }
      }
      return {
        3: { description: '![book](book) Bold (p.113)' },
        9: { description: '![book](book) See the Truth (p.167)' },
      }
    },
    get understandingMilestones() {
      if (self.type === 'pots') {
        return {
          3: { description: '![book](book) Awake (DK p.11)' },
          9: { description: '![book](book) White Secret (p.181)' },
        }
      }
      return {
        3: { description: '![book](book) Insight (p.131)' },
        9: { description: '![book](book) White Secret (p.181)' },
      }
    },
    get data() {
      return getSnapshot(self)
    },
    get bonuses() {
      let bonuses = []
      // get innovation bonuses
      for (let [key, inno] of self.innovations) {
        if (inno.bonus !== '') {
          bonuses.push({ source: inno, description: inno.bonus })
        }
      }
      // get principles bonuses
      for (let principle of ['death', 'newlife', 'society', 'conviction']) {
        if (self.principles[principle] && self.principles[principle].bonus) {
          bonuses.push({
            source: self.principles[principle],
            description: self.principles[principle].bonus,
          })
        }
      }

      return bonuses
    },
    get endeavors() {
      let concatArrays = R.reduce((acc, item) => {
        let endeavors = item.endeavors.map(
          e => Object.assign({}, e, { source: item }) // add source reference for the UI.
        )
        return acc.concat(endeavors)
      }, [])

      let endeavors = concatArrays(self.innovations.values()).concat(
        concatArrays(self.locations.values())
      )

      return endeavors.filter(item => {
        if (
          item.recipe.not_location &&
          self.locations.has(item.recipe.not_location)
        ) {
          return false
        }
        if (
          item.recipe.not_innovation &&
          self.innovations.has(item.recipe.not_innovation.id) // innovations is a reference, locations are strings :(
        ) {
          return false
        }
        if (
          item.recipe.innovation &&
          !self.innovations.has(item.recipe.innovation.id) // innovations is a reference, locations are strings :(
        ) {
          return false
        }

        return true
      })
    },
  }))
