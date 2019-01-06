const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const shiftsSchema = new Schema({
  start_date: { type: Date },
  user_id:
    {
      type: Schema.Types.ObjectId,
      ref: "Worker"
    },
  planning_id: { type: Number } 
});

const Shift = mongoose.model('Shift', shiftsSchema);
module.exports = Shift;