import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import './sidebar.css';
import { IconButton } from '@material-ui/core';
import LargeDonutIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import SidebarChat from './SidebarChat';


const Sidebar = () => {
  return (
    <div className="sidebar">
      
      <div className="sidebar__header">
        <Avatar />
        <div className="sidebar__headerRight">
          <IconButton>
            <LargeDonutIcon />
          </IconButton>

          <IconButton>
            <ChatIcon /> 
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input type="text" placeholder="Search ..."/>
        </div>
      </div>

      <div className="sidebar__chats">
        <SidebarChat />
        <SidebarChat />
        <SidebarChat />
        <SidebarChat />
      </div>

    </div>
  )
}

export default Sidebar;
