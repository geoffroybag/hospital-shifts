const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const workerSchema = new Schema({
  first_name: { type: String, required: true },
  status: {type: String, enum: ["medic", "interne", "interim"]},  
});

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;