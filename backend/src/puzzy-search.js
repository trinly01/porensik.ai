const escapeStrRx = string => string.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
const Typo = require("typo-js");

var path = require('path')
const fs = require('fs');
var dictionaryPath = path.join(__dirname, '..', 'node_modules/typo-js/dictionaries/en_US')
const aff = fs.readFileSync(path.join(dictionaryPath, 'en_US.aff'), 'utf8')
const dic = fs.readFileSync(path.join(dictionaryPath, 'en_US.dic'), 'utf8')
const dictionary = new Typo( "en_US", aff, dic );

const regex = function (str) {
  const r1 = new RegExp('(?=.*' + escapeStrRx(str).replace(/ +?/g, ')(?=.*') + ').+', 'ig')
  let str2 = suggest(str)
  const r2 = new RegExp('(?=.*' + escapeStrRx(str2).replace(/ +?/g, ')(?=.*') + ').+', 'ig')
  return new RegExp(r1.source + '|' + r2.source, 'ig')
}

const search = function (str, value) {
  const r1 = new RegExp('(?=.*' + escapeStrRx(str).replace(/ +?/g, ')(?=.*') + ').+', 'ig');
  if (value.match(r1) !== null) return true

  let str2 = suggest(str);
  const r2 = new RegExp('(?=.*' + escapeStrRx(str2).replace(/ +?/g, ')(?=.*') + ').+', 'ig');
  return (value.match(r2) !== null);
}

const suggest = function (str) {
  let keywords = str.split(/ +?/g);
  for (var i = 0, len = keywords.length; i < len; i++) {
    let suggestion = dictionary.suggest(keywords[i])
    if (suggestion.length)
      keywords[i] = suggestion[0];
  }
  return keywords.join(' ');
}

module.exports = {
  search,
  suggest,
  regex
}