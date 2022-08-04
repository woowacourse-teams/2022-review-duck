import logo from './logo.svg';
import './App.css';
import Topbar from './components/topbar/Topbar'
import Sidebar from './components/sidebar/Sidebar'
import Home from './pages/home/Home'
import Axios from "axios"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react';
import MemberList from './pages/memberList/MemberList'
import Member from './pages/member/Member'
import ReviewFormList from './pages/reviewFormList/ReviewFormList'
import ReviewList from './pages/reviewList/ReviewList'

function App() {

  return (
    <Router>
      <Topbar />
      <div className='container'>
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/members" element={<MemberList />}/>
          <Route path="/members/:memberId" element={<Member />}/>
          <Route path="/review-forms" element={<ReviewFormList />}/>
          <Route path="/reviews" element={<ReviewList />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;
