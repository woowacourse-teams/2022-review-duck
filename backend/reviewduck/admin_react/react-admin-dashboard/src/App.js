import './App.css';
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
          <Route path="/review-forms/:reviewFormCode" element={<ReviewForm />}/>
          <Route path="/reviews" element={<ReviewList />}/>
          <Route path="/reviews/:reviewId" element={<Review />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;
