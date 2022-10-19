module.exports = function (app) {
  return async function opendata(req, res, next) {
    console.log('opendata middleware is running');
    if (req.query.s) {
      const condition = {
        $limit: 10,
        $search: req.query.s,
        $sort: {
          'logs.0.timestamp': -1
        },
        trash: {
          $ne: true
        }
      }
      const $or = [
        { 'security.public': true }
      ]
      let resultFiles = await app.service('juan-files').find({
        query: {
          ...condition,
          $or
        }
      })
      res.json(resultFiles);
    }
    else {
      next()
    }
  };
};
