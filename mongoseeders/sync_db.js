// this script will update from json file to the database by checking id field

(async () => {
  try {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    mongoose.connect('mongodb+srv://footyamigo-sandbox:pGazD7iuKW1wwCSV@cluster0.aapbr.mongodb.net/footyamigo-sandbox?retryWrites=true&w=majority');

    const OutcomeSchema = new Schema(
      {
        id: { type: Number, required: true },
        code: { type: String, required: true },
        label: { type: String, required: true },
        active: Boolean,
        is_bet_builder: Boolean,
        priority: { type: Number, default: 0 }, // just used for ordering in the list
        type: {  // used only for pre-match strategy or in-play or both.
          type: String,
          required: true,
          enum: ["both", "pre-match", "in-play"],
          default: "both",
        },
      },
      { strict: false },
      { collection : 'outcomes' }
    );
    
    const Outcome = mongoose.model('Outcome', OutcomeSchema);
    const outcomeJson = require('./outcomes.json');
    Promise.all(outcomeJson.map(async (outcome) => {
      await Outcome.findOneAndReplace({id: outcome.id}, {...outcome}, {projection: {id: 1, code: 1}});
    })).then(() => {
      console.log("DONE");
    });
  } catch (err) {
    console.error(err);
  }
})()
