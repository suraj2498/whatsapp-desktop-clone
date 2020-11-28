const mongoose = require('mongoose');

const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  chatRoom: String,
  senderId: String
});

module.exports = mongoose.model('messageContent', whatsappSchema);