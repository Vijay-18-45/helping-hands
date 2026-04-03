import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage        from './pages/LandingPage';
import ServeToSociety     from './pages/ServeToSociety';
import VolunteerLogin     from './pages/VolunteerLogin';
import DonorLogin         from './pages/DonorLogin';
import VolunteerRegister  from './pages/VolunteerRegister';
import DonorRegisterFixed from './pages/DonorRegisterFixed';
import VolunteerDashboard from './pages/VolunteerDashboard';
import DonorDashboard     from './pages/DonorDashboard';
import ImpactPage         from './pages/ImpactPage';
import AboutPage          from './pages/AboutPage';
import RequestorLogin     from './pages/RequestorLogin';
import RequestorRegister  from './pages/RequestorRegister';
import RequestorDashboard from './pages/RequestorDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/"                       element={<LandingPage />} />
          <Route path="/serve"                  element={<ServeToSociety />} />
          <Route path="/volunteer/login"        element={<VolunteerLogin />} />
          <Route path="/donor/login"            element={<DonorLogin />} />
          <Route path="/volunteer/register"     element={<VolunteerRegister />} />
          <Route path="/donor/register"         element={<DonorRegisterFixed />} />
          <Route path="/impact"                 element={<ImpactPage />} />
          <Route path="/about"                  element={<AboutPage />} />
          <Route path="/requestor/login"        element={<RequestorLogin />} />
          <Route path="/requestor/register"     element={<RequestorRegister />} />
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteer/dashboard"
            element={
              <ProtectedRoute requiredRole="volunteer">
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requestor/dashboard"
            element={
              <ProtectedRoute requiredRole="requestor">
                <RequestorDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
