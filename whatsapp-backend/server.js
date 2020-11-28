// requiring imports
const express = require('express');
const mongoose = require('mongoose');
const Messages = require('./dbMessages.js');
const Rooms = require('./chatRooms.js');
const Pusher  = require('pusher');
const cors = require('cors');

// app config
const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

// DB config
const connectionURL = "mongodb+srv://admin:DaGcnsQP3w08Kzf2@cluster0.8zha9.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Pusher config
const pusher = new Pusher({
  appId: "1107287",
  key: "e0e20dfc6c87315aa771",
  secret: "c972d5cd247dbfea08f0",
  cluster: "us2",
  useTLS: true
});

// trigger pusher on db change
const db = mongoose.connection;
db.once('open', () => {
  console.log('db connected');

  const msgCollection = db.collection('messagecontents');
  const changeStream = msgCollection.watch();

  changeStream.on('change', (change) => {
    console.log(change);

    if(change.operationType === 'insert'){
      const messageDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted', {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        chatRoom: messageDetails.chatRoom,
        senderId: messageDetails.senderId
      });
    }
    else {
      console.log('Error triggering pusher');
    }
  });
});



// api routes

// Get all messages
app.get('/api/messages/sync', (req, res) => {
  Messages.find((err, data) => {
    if(err) 
      res.status(500).send(err);
    else
      res.status(200).json(data);
  });
});

// Create a new message
app.post('/api/messages/new', (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if(err) 
      res.status(500).send(err);
    else
      res.status(201).json(data);
  });
});

// create a new chat room
app.post('/api/rooms/new', (req, res) => {
  const room = req.body;

  Rooms.create(room, (err, data) => {
    if(err)
      res.status(500).send(err);
    else
      res.status(201).json(data);
  })
});

app.get('/api/rooms/sync', (req, res) => {
  Rooms.find((err, data) => {
    if(err)
      res.status(500).send(err);
    else{
      res.status(200).json(data);
    }
  })
});

// listener
app.listen(PORT, () => {console.log(`Listening on ${PORT}`)});
