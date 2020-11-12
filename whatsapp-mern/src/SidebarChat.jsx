import React from 'react';
import { Avatar } from '@material-ui/core';
import './sidebarChat.css';

const SidebarChat = () => {
  return (
    <div className="sidebarChat">
      <Avatar src={``}/>
      <div className="sidebarChat__info">
        <h2>Chat Room Name</h2>
        <p>Last Sent chat</p>
      </div>
    </div>
  )
}

export default SidebarChat;
