const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlSchema = new Schema({
  original: String,
  shortened: String
});

mongoose.model('urls', urlSchema);
