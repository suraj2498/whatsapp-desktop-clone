import React, { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Login from './Login';
import firebase from 'firebase';
import { fbAuth } from './firebase';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Pusher from 'pusher-js';
import axios from './axios';
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import { Button } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    outline: 'none',
    borderRadius: '5px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    flexDirection: 'column',
  },
  mb3: {
    marginBottom: '8px'
  }
}));

function App() {

  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState({})
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [addChatOpen, setAddChatOpen] = useState(false);
  const [addRoomValue, setAddRoomValue] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const history = useHistory();
  const classes = useStyles();

  // initially fetch all the texts from the db
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get('/api/messages/sync');
      setMessages(response.data);
    }

    const fetchRooms = async () => {
      const response = await axios.get('/api/rooms/sync');
      setRooms(response.data);
      response.data[0] && setActiveRoom({
        name: response.data[0].name,
        id: response.data[0]._id
      });
    }

    fetchMessages();
    fetchRooms();
  }, []);


  // connect the pusher channel and bind the listener
  useEffect(() => {
    const pusher = new Pusher('e0e20dfc6c87315aa771', {
      cluster: 'us2'
    });
  
    const channel = pusher.subscribe('messages');
      channel.bind('inserted', (newMessage) => {
        setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);


  // Check if user is still logged in (maintain the session)
  useEffect(() => {
    const unsubscribe = fbAuth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser);
        if(user){
          setUserDetails({
            displayName: user.providerData[0].displayName,
            uid: user.providerData[0].uid,
            photoURL: user.providerData[0].photoURL
          });

          history && history.push('/chats');
        }
      }
      else
        setUser(null);
    });

    return () => unsubscribe();
  }, [user, history]);

  // handle google signin
  const onGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    fbAuth.signInWithPopup(provider)
      .catch((error) => {
        console.log(error);
      });
  }

  // Open and close modal
  const handleOpen = () => {
    setAddChatOpen(true);
  };

  const handleClose = () => {
    setAddChatOpen(false);
  };

  const submitNewRoom = async () => {
    const response = await axios.post('/api/rooms/new', {
      name: addRoomValue
    });

    setAddChatOpen(false);
    setAddRoomValue('');
    setRooms([...rooms, response.data])
  }


  return (
      <Switch>
        <Route exact path="/chats">
          {
            !user ? <Redirect to="/" /> : <Redirect to="/chats" />
          }
          <div className="app">
            <div className="app__body">
              {/* Sidebar */}
              <Sidebar activeRoom={activeRoom} currentSearch={currentSearch} setCurrentSearch={setCurrentSearch} setActiveRoom={setActiveRoom} openModal={handleOpen} rooms={rooms} photoURL={userDetails.photoURL}/>
              {/* Chat */}
              <Chat currentSearch={currentSearch} activeRoom={activeRoom} displayName={userDetails.displayName} messages={messages} sender={userDetails.uid}/>
            </div>

            {/* add chat modal */}
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={addChatOpen}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 300,
              }}
            >
              <Fade in={addChatOpen}>
                <div className={classes.paper}>
                  <h3 className={classes.mb3}>Add Room</h3>
                  <TextField 
                    required 
                    id="standard-required" 
                    label="Required" 
                    placeholder="RoomName" 
                    value={addRoomValue}
                    onChange={(e) => setAddRoomValue(e.target.value)}
                    className={classes.mb3}/>
                  <Button onClick={submitNewRoom}>
                    Add Room
                  </Button>
                </div>
              </Fade>
            </Modal>
          </div>
        </Route>

        <Route exact path="/">
          <Login onGoogleLogin={onGoogleLogin} />
        </Route>
      </Switch>
  );
}

export default App;


