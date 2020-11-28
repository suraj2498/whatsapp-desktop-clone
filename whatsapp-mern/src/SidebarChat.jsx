import React from 'react';
import { Avatar } from '@material-ui/core';
import './sidebarChat.css';

const SidebarChat = ({ name, id, onClick }) => {

  const passRoomDetails = () => {
    onClick(name, id);
  }

  return (
    <div className="sidebarChat" onClick={passRoomDetails}>
      <Avatar src={`https://avatars.dicebear.com/api/bottts/${id}.svg`}/>
      <div className="sidebarChat__info">
        <h2>{name}</h2>
      </div>
    </div>
  )
}

export default SidebarChat;
