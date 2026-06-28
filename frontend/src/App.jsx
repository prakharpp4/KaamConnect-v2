import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Jobs from './pages/Jobs.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Profile from './pages/Profile.jsx'
import PostJob from './pages/PostJob.jsx'
import MyJobs from './pages/MyJobs.jsx'
import MyApplications from './pages/MyApplications.jsx'
import JobApplicants from './pages/JobApplicants.jsx'
import RatePage from './pages/RatePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/job/:id/applicants" element={<JobApplicants />} />
        <Route path="/rate/:applicationId" element={<RatePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App