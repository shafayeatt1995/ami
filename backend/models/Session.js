const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({}, {strict: false});
const Session = mongoose.model('Session', SessionSchema);

// Session.deleteMany({}).then((x) => console.log(x));
module.exports = Session;
