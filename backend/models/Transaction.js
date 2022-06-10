const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    id: {type: String, required: false},
    checkout_id: {type: String, required: true},
    order_id: {type: String, required: true},
    payment_id: String,
    subscription_id: {type: String},
    email: {type: String, required: true},
    amount_usd: Number,
    amount: Number,
    currency: String,
    status: String,
    receipt_url: String,
    plan_id: Number,
    payment_method: String,
    gateway: {type: String, required: true},
  },
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);

// Transaction.create = function(data) {
//   return this.transaction(async trx => {
//     const transaction = await Transaction.query(trx)
//       .insert(data)
//       .onConflict()
//       .merge();
//     return transaction;
//   });
// };

// Transaction.deleteMany({}).then((x) => console.log(x));
// Transaction.insertMany(transactions).then((x) => console.log("inserted", x));
Transaction.findLatest = function (email) {
  return this.findOne({status: 'success', email});
};

Transaction.updateData = function (checkout_id, data) {
  return this.findOneAndUpdate({checkout_id}, data);
};

Transaction.updateStatus = function (checkout_id, status) {
  return this.updateOne({checkout_id}, {status});
};

module.exports = Transaction;
