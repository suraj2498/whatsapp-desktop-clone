const mongoose = require('mongoose');

const roomSschema = mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('chatroom', roomSschema);