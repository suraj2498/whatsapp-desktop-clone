import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import './chat.css';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { MoreVert, InsertEmoticon, Mic } from '@material-ui/icons';
import axios from './axios';
import Picker from 'emoji-picker-react';
import cx from 'classnames';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { fbAuth } from './firebase';

const Chat = ({ messages, activeRoom, sender, displayName, currentSearch }) => {

  const [input, setInput] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const [chatRoomMessages, setChatRoomMessages] = useState([]);
  const [lastSeen, setLastSeen] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const { transcript , resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if(currentSearch){
      setChatRoomMessages(messages.filter(message => message.chatRoom === activeRoom.name && message.message.includes(currentSearch)));
    }
    else {
      setChatRoomMessages(messages.filter(message => message.chatRoom === activeRoom.name));
    }
  }, [activeRoom, messages, currentSearch]);

  useEffect(() => {
    if(chatRoomMessages.length > 0)
      setLastSeen(chatRoomMessages[chatRoomMessages.length - 1].timestamp);
  }, [chatRoomMessages, setLastSeen]);

  const onEmojiClick = (event, emojiObject) => {
    event.preventDefault();
    setInput(input + emojiObject.emoji);
  };

  const toggleEmojiOpen = () => {
    setEmojiOpen(!emojiOpen);
  }

  const toggleMicOpen = () => {
    // toggle mic open
    setMicOpen(!micOpen);

    if(!micOpen){
      resetTranscript();
      SpeechRecognition.startListening();
    }
    else{
      SpeechRecognition.stopListening();
      setInput(input + transcript);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      message: input,
      name: displayName,
      timestamp: new Date().toLocaleTimeString(),
      chatRoom: activeRoom.name,
      senderId: sender
    }

    await axios.post("api/messages/new", newMessage);

    setInput('');
    setEmojiOpen(false);
  }

  const handleLogout = () => {
    fbAuth.signOut().catch(error => console.log(error))
    setAnchorEl(null);
    history.push('/');
  }

  console.log(chatRoomMessages)

  return (
    <div className="chat">
      <div className="chat__header">
        
        <Avatar src={`https://avatars.dicebear.com/api/bottts/${activeRoom.id}.svg`}/>

        <div className="chat__headerInfo">
          <h3>{activeRoom.name || 'No Active Chats'}</h3>
          <p>{lastSeen && "Last active at " + lastSeen || 'Chat Not Active'}</p>
        </div>

        <div className="chat__headerRight">
            <IconButton aria-controls="logout" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVert/>
            </IconButton>

              <Menu
                id="logout"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
        </div>

      </div>

      <div className="chat__body">
          
          {
            chatRoomMessages && chatRoomMessages.map((message) => ( 
              message.chatRoom === activeRoom.name && 
              <p key={message.timestamp} className={message.senderId === sender ? 'chat__message chat__reciever' : 'chat__message'}>
                <span className="chat__name">{message.name}</span>
                {message.message}
                <span className="chat__timestamp">{message.timestamp}</span>
              </p>
            ))
          }
      </div>

      <div className="chat__footer">
        <InsertEmoticon onClick={toggleEmojiOpen}/>

        <div className={cx(!emojiOpen ? 'd-none' : null, 'chat__footer__emoji')}>
          <Picker onEmojiClick={onEmojiClick} />
        </div>
        
        <form>
          <input type="text" value={input} placeholder="Send a message" onChange={e => setInput(e.target.value)}/>
          <button type="submit" onClick={handleSubmit}></button>
        </form>

        <div className={cx(!micOpen ? 'd-none' : null, "chat__footer__micContainer")}>
          <div className="chat__footer__circle">
            <Mic />
          </div>
          <h2>Listening ...</h2>
        </div>
        <Mic onClick={toggleMicOpen}/>
      </div>
    </div>
  )
}

export default Chat;
