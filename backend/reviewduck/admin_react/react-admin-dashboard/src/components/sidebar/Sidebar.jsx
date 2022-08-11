import React from 'react';
import './sidebar.css';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import { Link } from 'react-router-dom';

export default function sidebar(props) {
  const isLogin = props.isLogin;

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <Link to="/">
                <HomeWorkIcon />
                Home
              </Link>
            </li>
            <li className="sidebarListItem">
              <TrendingUpIcon />
              Analytics
            </li>
            <li className="sidebarListItem">
              <MonetizationOnIcon />
              Sales
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              {isLogin ? (
                <Link to="/members">
                  <HomeWorkIcon />
                  Member
                </Link>
              ) : (
                <Link to="/">
                  <HomeWorkIcon />
                  로그인 필요
                </Link>
              )}
            </li>
            <li className="sidebarListItem">
              {isLogin ? (
                <Link to="/reviews">
                  <TrendingUpIcon />
                  Review
                </Link>
              ) : (
                <Link to="/">
                  <TrendingUpIcon />
                  로그인 필요
                </Link>
              )}
            </li>
            <li className="sidebarListItem">
              {isLogin ? (
                <Link to="/review-forms">
                  <MonetizationOnIcon />
                  ReviewForm
                </Link>
              ) : (
                <Link to="/">
                  <MonetizationOnIcon />
                  로그인 필요
                </Link>
              )}
            </li>
            <li className="sidebarListItem">
              {isLogin ? (
                <Link to="/templates">
                  <MonetizationOnIcon />
                  Template
                </Link>
              ) : (
                <Link to="/">
                  <MonetizationOnIcon />
                  로그인 필요
                </Link>
              )}
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notification</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <HomeWorkIcon />
              Mail
            </li>
            <li className="sidebarListItem">
              <TrendingUpIcon />
              Feedback
            </li>
            <li className="sidebarListItem">
              <MonetizationOnIcon />
              Messages
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
