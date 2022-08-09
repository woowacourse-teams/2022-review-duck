import './App.css';
import React, {Component} from "react"
import Topbar from './components/topbar/Topbar'
import Sidebar from './components/sidebar/Sidebar'
import Home from './pages/home/Home'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MemberList from './pages/memberList/MemberList'
import Member from './pages/member/Member'
import ReviewFormList from './pages/reviewFormList/ReviewFormList'
import ReviewForm from './pages/reviewForm/ReviewForm'
import ReviewList from './pages/reviewList/ReviewList'
import Review from './pages/review/Review'

import axios from "axios"

class App extends Component{
  constructor(){
    super();
    this.state = {
      isLogin : false,
      accessToken : ''
    }
    this.getToken = this.getToken.bind(this);
  }

  async getToken(code) {

    const getToken = await axios.post('http://localhost:8080/api/login', 
    { code: code })
    
    this.setState ({
      isLogin: true,
      accessToken: getToken.data['accessToken']
    })
  }

  componentDidMount() {
    const url = new URL(window.location.href)
    const authorizationCode = url.searchParams.get('code')
    if (authorizationCode) {
      this.getToken(authorizationCode)
      console.log(authorizationCode)
    }
  }

  render() {
    const {isLogin, accessToken} = this.state;
    const API_URI = "http://localhost:8080/api/admin"
    return (
      <Router>
        <Topbar />
        <div className='container'>
          <Sidebar isLogin={isLogin}/>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/members" element={<MemberList API_URI = {API_URI} accessToken={accessToken}/>}/>
            <Route path="/members/:memberId" element={<Member API_URI = {API_URI} accessToken={accessToken}/>}/>
            <Route path="/review-forms" element={<ReviewFormList API_URI = {API_URI} accessToken={accessToken}/>}/>
            <Route path="/review-forms/:reviewFormCode" element={<ReviewForm API_URI = {API_URI} accessToken={accessToken}/>}/>
            <Route path="/reviews" element={<ReviewList API_URI = {API_URI} accessToken={accessToken}/>}/>
            <Route path="/reviews/:reviewId" element={<Review API_URI = {API_URI} accessToken={accessToken}/>}/>
          </Routes>
        </div>
      </Router>
    )
  }
}

export default App;
