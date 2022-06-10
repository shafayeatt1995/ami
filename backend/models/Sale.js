const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new Schema(
  {
    seller_id: {type: Schema.Types.ObjectId, required: true},
    buyer_id: {type: Schema.Types.ObjectId, required: true},
    strategy_id: {type: Schema.Types.ObjectId, required: true},
    price: {type: Number, required: true},
    date_time: {type: Date, default: Date.now},
  },
  {strict: false}
);
const Sale = mongoose.model('Sale', SaleSchema);

// Sale.findForAdmin = function () {
//   return this.find();
// };

// Sale.createByAdmin = function (body) {
//   const {name, price, days, trial} = body;
//   return this.create({
//     name,
//     price,
//     days,
//     trial,
//   });
// };

// // Sale.create({ name: "Demo" }).then(x=> console.log("HIT", x));
// Sale.editByAdmin = function (body) {
//   const {_id, name, price, days, trial} = body;
//   return this.findByIdAndUpdate(_id, {
//     name,
//     price,
//     days,
//     trial,
//   });
// };

module.exports = Sale;
