var Typo = require("typo-js");
var dictionary = new Typo( "en_US" );

module.exports = function (options = {}) {
  return function suggestspell(req, res, next) {
    if (req.query.str) {
      let keywords = req.query.str.split(/ +?/g);
      for (var i = 0, len = keywords.length; i < len; i++) {
        let suggestion = dictionary.suggest(keywords[i])
        if (suggestion.length)
          keywords[i] = suggestion[0];
      }
      res.json(keywords);
    }
    else {
      next()
    }
  };
};
