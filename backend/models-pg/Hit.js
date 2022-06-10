const {Model} = require('objection');

/**
 *
 */
class Hit extends Model {
  /**
   *
   */
  static get tableName() {
    return 'straptegy_hits';
  }
}

Hit.find = function (fixture_id, type) {
  console.log(fixture_id, type);
  return this.query().findOne({
    fixture_id,
    type,
  });
};
/*
Hit.query().delete().whereNull("home_win").then(res=> {
  console.log(res)
})*/
/*
Hit.findPeak = function (fixture_id) {
  return this.query()
    .where({
      fixture_id,
      type: "peakhits",
    })
    .findOne();
};
Hit.findPrematch = function (fixture_id) {
  return this.query()
    .where({
      fixture_id,
      type: "prehits",
    })
    .findOne();
};
Hit.findLive= function (fixture_id) {
  return this.query()
    .where({
      fixture_id,
      type: "livehits",
    })
    .findOne();
};
*/

module.exports = Hit;
