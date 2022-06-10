const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {ObjectId} = require('mongoose').Types;

const HitSchema = new Schema(
  {
    fixture_id: {type: ObjectId, required: true},
    strategy_id: {type: ObjectId, required: true},
    away_name: {type: String},
    country_name: {type: String},
    date: {type: Date, required: true},
    fixture_name: {type: String},
    ft_score: {type: String},
    home_name: {type: String},
    is_hit: {type: Boolean},
    league_id: {type: Number},
    league_name: {type: String},
    odds: {type: Number},
    timestamp: {type: Number, required: true},
  },
  {
    strict: false,

    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

// unique index fixture_id and dtrategy_id
// HitSchema.index({ fixture_id: 1, strategy_id: 1 }, { unique: true });

const Hit = mongoose.model('Hit', HitSchema, 'strategy_hits');
// count unique strategy_id
// Hit.aggregate([{$group: {_id: '$strategy_id', count: {$sum: 1}}}]).then((x) =>
//   console.log(x)
// );
module.exports = Hit;
