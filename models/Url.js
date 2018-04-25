const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlSchema = new Schema({
  original: String,
  shortId: String
});

mongoose.model('urls', urlSchema);
