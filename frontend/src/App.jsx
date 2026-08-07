import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import Requests from './pages/owner/Requests';
import Earnings from './pages/owner/Earnings';
import CreateListing from './pages/owner/CreateListing';
import VehicleSettings from './pages/owner/VehicleSettings';

// Renter Pages
import RenterDashboard from './pages/renter/Dashboard';
import Browse from './pages/renter/Browse';
import BookVehicle from './pages/renter/BookVehicle';

// Passenger Pages
import RideSearch from './pages/passenger/RideSearch';

import './App.css';

function App() {
  const { role } = useAuth();

  return (
    <>
      <TopNav />
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            role === 'owner' ? <Navigate to="/owner/dashboard" /> :
            role === 'renter' ? <Navigate to="/renter/dashboard" /> :
            <Navigate to="/passenger/search" />
          } />
          
          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/requests" element={<Requests />} />
          <Route path="/owner/earnings" element={<Earnings />} />
          <Route path="/owner/create" element={<CreateListing />} />
          <Route path="/owner/settings/:id" element={<VehicleSettings />} />
          
          {/* Renter Routes */}
          <Route path="/renter/dashboard" element={<RenterDashboard />} />
          <Route path="/renter/browse" element={<Browse />} />
          <Route path="/renter/book/:id" element={<BookVehicle />} />
          
          {/* Passenger Routes */}
          <Route path="/passenger/search" element={<RideSearch />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
