const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeagueSchema = new Schema(
  {
    id: {type: Number, unique: true},
    name: {type: String},
    country_id: {type: Number},
    country_name: {type: String, index: true},
  },
  {strict: false}
);
const League = mongoose.model('League', LeagueSchema);

League.findAll = function () {
  return this.find({}, {id: 1, country_id: 1, name: 1, country_name: 1}).sort({
    country_name: 1,
  });
};

League.findByLeagueId = async function (league_id) {
  return this.findOne(
    {id: league_id},
    {id: 1, country_id: 1, name: 1, country_name: 1}
  );
};

League.findByLeagueIds = async function (league_ids = []) {
  return this.find(
    {id: {$in: league_ids}},
    {id: 1, country_id: 1, name: 1, country_name: 1}
  );
};

League.groupByCountries = function () {
  return League.aggregate([
    {
      $project: {
        league_id: 1,
        country_name: 1,
        league_name: '$name',
        country_id: 1,
        iso: '$extra.iso2',
      },
    },
    {
      $group: {
        _id: '$country_id',
        id: {$first: '$country_id'},
        name: {$first: '$country_name'},
        iso: {$first: '$iso'},
        leagues: {
          $push: {league_id: '$league_id', league_name: '$league_name'},
        },
        // excluded: {
        //   $push: "$league_id"
        // }
      },
    },
    // {
    //   $addFields: {
    //     included: []
    //   }
    // },
    {$sort: {name: 1}},
  ]);
};

League.findCountries = function () {
  return League.find(
    {},
    {
      league_id: 1,
      country_name: 1,
      league_name: '$name',
      country_id: 1,
      iso: '$extra.iso2',
    }
  );
};
module.exports = League;
