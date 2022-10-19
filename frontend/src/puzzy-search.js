const escapeStrRx = string => string.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&')
const Typo = require('typo-js')

// var path = require('path')
// const fs = require('fs');
// var dictionaryPath = path.join(__dirname, 'node_modules/typo-js/dictionaries/en_US')
var aff = require('typo-js/dictionaries/en_US/en_US.aff').default
var dic = require('typo-js/dictionaries/en_US/en_US.dic').default
const dictionary = new Typo('en_US', aff, dic)

const regex = function (str) {
  const r1 = new RegExp('(?=.*' + escapeStrRx(str).replace(/ +?/g, ')(?=.*') + ').+', 'ig')
  let str2 = suggest(str)
  const r2 = new RegExp('(?=.*' + escapeStrRx(str2).replace(/ +?/g, ')(?=.*') + ').+', 'ig')
  return new RegExp(r1.source + '|' + r2.source, 'ig')
}

const search = function (str, value) {
  const r1 = new RegExp('(?=.*' + escapeStrRx(str).replace(/ +?/g, ')(?=.*') + ').+', 'ig')
  if (value.match(r1) !== null) return true

  let str2 = suggest(str)
  const r2 = new RegExp('(?=.*' + escapeStrRx(str2).replace(/ +?/g, ')(?=.*') + ').+', 'ig')
  return (value.match(r2) !== null)
}

const suggest = function (str) {
  let keywords = str.split(/ +?/g)
  for (var i = 0, len = keywords.length; i < len; i++) {
    let suggestion = dictionary.suggest(keywords[i])
    if (suggestion.length) keywords[i] = suggestion[0]
  }
  return keywords.join(' ')
}

export default {
  search,
  suggest,
  regex
}
