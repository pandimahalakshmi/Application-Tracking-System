import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import JobForm from "./pages/JobForm";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import CandidateDetailPage from "./pages/CandidateDetailPage";
import ScheduleInterviewPage from "./pages/ScheduleInterviewPage";
import MyApplications from "./pages/MyApplications";
import AdminApplications from "./pages/AdminApplications";
import SavedJobs from "./pages/SavedJobs";
import ForgotPassword from "./pages/ForgotPassword";
import SettingsPage from "./pages/SettingsPage";
import ResetPassword from "./pages/ResetPassword";
import JobDescriptionPage from "./pages/JobDescriptionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/home"   element={<LandingPage />} />
        <Route path="/login"  element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/dashboard"           element={<AdminDashboard />} />
        <Route path="/userdashboard"       element={<UserDashboard />} />
        <Route path="/user-profile"        element={<UserProfile />} />
        <Route path="/jobs"                element={<Jobs />} />
        <Route path="/jobs/:id"            element={<JobDescriptionPage />} />
        <Route path="/jobform"             element={<JobForm />} />
        <Route path="/candidates"          element={<Candidates />} />
        <Route path="/candidates/:id"      element={<CandidateDetailPage />} />
        <Route path="/schedule-interview"  element={<ScheduleInterviewPage />} />
        <Route path="/my-applications"     element={<MyApplications />} />
        <Route path="/my-applications/:applicationId" element={<MyApplications />} />
        <Route path="/admin/applications"  element={<AdminApplications />} />
        <Route path="/admin/applications/:applicationId" element={<AdminApplications />} />
        <Route path="/saved-jobs"          element={<SavedJobs />} />
        <Route path="/settings"             element={<SettingsPage />} />
        <Route path="/forgot-password"     element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*"                    element={<h2 style={{color:'#fff',textAlign:'center',marginTop:'20vh'}}>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
