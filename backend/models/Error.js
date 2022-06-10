const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErrorSchema = new Schema({}, {strict: false});
const Error = mongoose.model('Error', ErrorSchema);

Error.deleteByStrategyID = function (strategy_id) {
  return this.deleteMany({'strategy._id': strategy_id});
};

// Delete  message having partial text duplicate key error collection:
// Error.deleteMany({
//   message: {
//     $regex: "'NoneType' object is not subscriptable",
//   },
// })
//   .then((x) => {
//     console.log('Successfully deleted', x);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = Error;
