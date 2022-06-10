const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Paste one or more documents here
 */
// {
//   "id": 2,
//   "title": "The Zero Shots On Target @ 15Min System 🤑",
//   "description": "This is a very very special system. Very high odds and simple to follow. You do not even have to wait till the end of the match for profit. We will be using the power of data available to Footy Amigo to beat the bookies in their own game. The system is called \"The Zero Shots On Target @15Mins Profit System\" for a reason. ",
//   "roi": 500,
//   "video_embed": "<div style=\"padding:56.25% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/650221001?h=37a894417d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" title=\"Footy Amigo Final HD.mp4\"></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"></script>",
//   "video_description": "This system follows placing an over 0.5 first half goal bet at the 15min of a match where there are ZERO shots on target and ZERO goals. What makes this system have such a high strike rate is the PreMatch stats added to it. Watch the video and see how it works. ",
//   "learn": "You will be learning and seeing a very simple but profitable 1st half goal system. This is where the power of data and Footy Amigo comes to the rescue.  (Disclaimer: Results are not typical. Before placing any bet with any system provided by us, spend som",
//   "active": 0,
//   "created_at": "2021-10-29T01:43:15.000Z",
//   "updated_at": "2022-01-17T07:30:16.000Z",
//   "preset_ids": [1095]
// }

const BettingSystemSchema = new Schema(
  {
    // id: { type: Number },
    title: {type: String, required: true},
    description: {type: String, required: true},
    roi: {type: Number, required: true},
    video_embed: {type: String, required: true},
    video_description: {type: String, required: true},
    learn: {type: String, required: true},
    active: {type: Boolean, required: true, default: false},
    preset_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Strategy',
      },
    ],
    presets: [Object],
  },
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);
const BettingSystem = mongoose.model('BettingSystem', BettingSystemSchema);

BettingSystem.findActive = function () {
  return this.find({active: true});
};
BettingSystem.findActiveById = function (id) {
  return this.findOne({_id: id, active: true}, {preset_ids: 0});
};

BettingSystem.toggleByAdmin = function (id) {
  return this.findByIdAndUpdate(id, [
    {$set: {active: {$eq: [false, '$active']}}},
  ]);
};

BettingSystem.createByAdmin = async function (body) {
  const {
    title,
    description,
    roi,
    video_embed,
    video_description,
    learn,
    active,
    preset_ids,
  } = body;
  const session = await this.startSession();
  return await session.withTransaction(async () => {
    const betting_system = await BettingSystem.create({
      title,
      description,
      roi,
      video_embed,
      video_description,
      learn,
      preset_ids,
      active,
    });
    await betting_system.populate('preset_ids', 'title hit_rate');
    betting_system.presets = betting_system.toObject().preset_ids;
    console.log(betting_system.toObject().preset_ids, 'HEHHHEHE');
    betting_system.preset_ids = preset_ids;
    await betting_system.save();
    return betting_system;
  });
};

BettingSystem.updateByAdmin = async function (body) {
  const {
    _id,
    title,
    description,
    roi,
    video_embed,
    video_description,
    learn,
    active,
    preset_ids,
  } = body;
  const session = await this.startSession();
  return await session.withTransaction(async () => {
    const betting_system = await BettingSystem.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        roi,
        video_embed,
        video_description,
        learn,
        active,
        preset_ids,
      },
      {new: true}
    );
    await betting_system.populate('preset_ids', 'title hit_rate');
    betting_system.presets = betting_system.toObject().preset_ids;
    betting_system.preset_ids = preset_ids;
    await betting_system.save();
    return betting_system;
  });
};

module.exports = BettingSystem;
