import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import Company from "./pages/Company";
import Register from "./pages/Register";
import RegisterCompany from "./pages/RegisterCompany";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import CompanyDashboard from "./pages/CompanyDashboard";
import Advertisers from "./pages/Advertisers";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import VerifyEmail from "./pages/VerifyEmail";
import Terms from "./pages/Terms";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-complaint" element={
            <ProtectedRoute>
              <NewComplaint />
            </ProtectedRoute>
          } />
          <Route path="/complaint-detail/:id" element={<ComplaintDetail />} />
          <Route path="/company/:id" element={<Company />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-company" element={<RegisterCompany />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredType="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/advertisers" element={<Advertisers />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/miqueja/api/verify-email" element={<VerifyEmail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
