var async = require('async');
var _ = require('lodash');
var siteInfoService = require('../services/site-info.service');
var categoriesService = require('../services/categories.service');
var listsService = require('../services/lists.service');

/**
 * 首页
 * @param {Object} req
 * @param {Object} res
 */
module.exports = function (req, res) {
  async.parallel({
    siteInfo: siteInfoService.get,
    navigation: function (callback) {
      categoriesService.navigation({ current: '/' }, callback);
    },
    lists: listsService.all,
    readingTotal: function (callback) {
      listsService.reading({}, callback);
    },
    readingDay: function (callback) {
      listsService.reading({ sort: '-reading.day' }, callback);
    },
    readingWeek: function (callback) {
      listsService.reading({ sort: '-reading.week' }, callback);
    },
    readingMonth: function (callback) {
      listsService.reading({ sort: '-reading.month' }, callback);
    }
  }, function (err, results) {
    if (err) return res.status(500).end();
    // 首页控制
    // console.log(JSON.stringify(results.lists))
    let arrayList = []
    _.map(results.lists,(item,key) => {
      [].push.apply(arrayList,item.contents)
    })

    arrayList.length = 20

    res.render('home', {
      layout: 'layout-default',
      siteInfo: results.siteInfo,
      navigation: results.navigation,
      lists: arrayList,
      readingList: {
        total: results.readingTotal,
        day: results.readingDay,
        week: results.readingWeek,
        month: results.readingMonth
      }
    });
  });
};