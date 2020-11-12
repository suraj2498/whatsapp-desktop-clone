import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import './chat.css';
import { IconButton } from '@material-ui/core';
import { SearchOutlined, AttachFile, MoreVert, InsertEmoticon, Mic } from '@material-ui/icons';

const Chat = () => {
  return (
    <div className="chat">
      <div className="chat__header">
        
        <Avatar />

        <div className="chat__headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at ...</p>
        </div>

        <div className="chat__headerRight">
            <IconButton>
              <SearchOutlined />
            </IconButton>

            <IconButton>
              <AttachFile /> 
            </IconButton>

            <IconButton>
              <MoreVert/>
            </IconButton>
        </div>

      </div>

      <div className="chat__body">
          <p className="chat__message">
            <span className="chat__name">Suraj</span>
            This is a message
            <span className="chat__timestamp">{new Date().toLocaleTimeString()}</span>
          </p>

          <p className="chat__message chat__reciever">
            <span className="chat__name">Suraj</span>
            This is a recieved message
            <span className="chat__timestamp">{new Date().toLocaleTimeString()}</span>
          </p>

          <p className="chat__message">
            <span className="chat__name">Suraj</span>
            This is a message
            <span className="chat__timestamp">{new Date().toLocaleTimeString()}</span>
          </p>
      </div>

      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input type="text" placeholder="Send a message"/>
          <button type="submit">Send a message</button>
        </form>
        <Mic />
      </div>
    </div>
  )
}

export default Chat;
