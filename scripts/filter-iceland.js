var _ = require('lodash')
var countries = require('../tmpdata/vectors.json')
var iceland = _.find(countries.features, (feature) => (
  feature.properties.ADM0_A3 === 'ISL'
))

console.log(JSON.stringify(iceland))
