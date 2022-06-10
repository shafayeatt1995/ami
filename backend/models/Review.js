const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const {ObjectId} = require('mongoose').Types;
const _ = require('lodash');

const User = require('./User');

const uuid = require('uuid');

const ReplySchema = new Schema(
  {
    title: {type: String},
    note: {type: String},
    date_time: {type: Date, default: Date.now},
  },
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const ReviewSchema = new Schema(
  {
    buyer_id: {type: ObjectId, ref: 'User'},
    seller_id: {type: ObjectId, ref: 'User'},
    rating: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating should be integer, got {VALUE}',
      },
    },
    title: {type: String},
    note: {type: String},
    date_time: {type: Date, default: Date.now},
    replies: [ReplySchema],
  },
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
