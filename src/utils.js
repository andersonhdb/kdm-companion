import R from 'ramda'
import { values } from 'mobx'

export const capitalize = R.replace(/^./, R.toUpper)

export function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    a => (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)[0]
  )
}

export function expansionFilter(map, expansion) {
  return R.filter(item => item.expansion.id === expansion.id, values(map))
}
