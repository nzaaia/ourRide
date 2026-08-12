import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';

// Public Pages
import LandingPage from './pages/LandingPage';

// Shared Pages
import ProfilePage from './pages/ProfilePage';
import Chat from './pages/Chat';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import Requests from './pages/owner/Requests';
import Earnings from './pages/owner/Earnings';
import CreateListing from './pages/owner/CreateListing';
import VehicleSettings from './pages/owner/VehicleSettings';
import OwnerRatings from './pages/owner/OwnerRatings';
import MyBikes from './pages/owner/MyBikes';

// Renter Pages
import RenterDashboard from './pages/renter/Dashboard';
import Browse from './pages/renter/Browse';
import BookVehicle from './pages/renter/BookVehicle';
import PastTrips from './pages/renter/PastTrips';
import SavedBikes from './pages/renter/SavedBikes';
import MyRatings from './pages/renter/MyRatings';
import RenterRequests from './pages/renter/RenterRequests';
import RenterEarnings from './pages/renter/Earnings';

// Passenger Pages
import RideSearch from './pages/passenger/RideSearch';

import './App.css';

function App() {
  const { isAuthenticated, role } = useAuth();

  const protectedEl = (el) => isAuthenticated ? el : <Navigate to="/" />;

  return (
    <>
      <TopNav />
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            !isAuthenticated ? <LandingPage /> :
            role === 'owner' ? <Navigate to="/owner/dashboard" /> :
            role === 'renter' ? <Navigate to="/renter/dashboard" /> :
            <Navigate to="/passenger/search" />
          } />

          {/* Public browsing routes (no login needed to view) */}
          <Route path="/renter/browse" element={<Browse />} />
          <Route path="/passenger/search" element={<RideSearch />} />

          {/* Protected shared */}
          <Route path="/chat" element={protectedEl(<Chat />)} />
          <Route path="/profile" element={protectedEl(<ProfilePage />)} />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={protectedEl(<OwnerDashboard />)} />
          <Route path="/owner/requests" element={protectedEl(<Requests />)} />
          <Route path="/owner/earnings" element={protectedEl(<Earnings />)} />
          <Route path="/owner/create" element={protectedEl(<CreateListing />)} />
          <Route path="/owner/bikes" element={protectedEl(<MyBikes />)} />
          <Route path="/owner/settings/:id" element={protectedEl(<VehicleSettings />)} />
          <Route path="/owner/ratings" element={protectedEl(<OwnerRatings />)} />

          {/* Renter Routes */}
          <Route path="/renter/dashboard" element={protectedEl(<RenterDashboard />)} />
          <Route path="/renter/book/:id" element={protectedEl(<BookVehicle />)} />
          <Route path="/renter/trips" element={protectedEl(<PastTrips />)} />
          <Route path="/renter/saved" element={protectedEl(<SavedBikes />)} />
          <Route path="/renter/ratings" element={protectedEl(<MyRatings />)} />
          <Route path="/renter/requests" element={protectedEl(<RenterRequests />)} />
          <Route path="/renter/earnings" element={protectedEl(<RenterEarnings />)} />
        </Routes>
      </div>
    </>
  );
}

export default App;
