const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubscriptionDetailSchema = new Schema(
  {},
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);
const SubscriptionDetail = mongoose.model(
  'SubscriptionDetail',
  SubscriptionDetailSchema
);

// SubscriptionDetail.create = function (data) {
//   return this.query().insert(data);
// };

SubscriptionDetail.cancel = function (subscription_id) {
  return this.findOneAndUpdate(
    {subscription_id},
    {update_url: null, cancel_url: null}
  );
};

module.exports = SubscriptionDetail;
