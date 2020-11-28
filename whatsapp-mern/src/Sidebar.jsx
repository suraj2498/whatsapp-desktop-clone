import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import './sidebar.css';
import { IconButton } from '@material-ui/core'; 
import AddIcon from '@material-ui/icons/Add';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import SidebarChat from './SidebarChat';


const Sidebar = ({ photoURL, rooms, setActiveRoom, openModal, currentSearch, setCurrentSearch }) => {

  const setRoom = (roomName, roomId) => {
    setActiveRoom({
      name: roomName,
      id: roomId
    });
  }

  return (
    <div className="sidebar">
      
      <div className="sidebar__header">
        <Avatar src={ photoURL }/>
        <div className="sidebar__headerRight">
          <IconButton onClick={openModal}>
            <AddIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input type="text" value={currentSearch} onChange={e => setCurrentSearch(e.target.value)} placeholder="Search Current Chat..."/>
        </div>
      </div>

      <div className="sidebar__chats">
        {
          rooms.map((room) => (
            <SidebarChat onClick={setRoom} key={room._id} id={room._id} name={room.name}/>
          ))
        }
      </div>

    </div>
  )
}

export default Sidebar;
