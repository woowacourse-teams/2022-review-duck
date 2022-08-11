import React from 'react';
import './topbar.css';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">ReviewDuck Admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsActiveIcon />
            <span className="topIconBadge">2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
