module.exports = function (app, options = {}) {
  return async function test(req, res, next) {
    try {
      let usersSrvc = app.service('users')
      let result = await usersSrvc.find({
        query: {}
      })
      res.json(result)
    } catch (error) {
      res.json(error.toString())
    }

    console.log('test middleware is running');
    next();
  };
};
