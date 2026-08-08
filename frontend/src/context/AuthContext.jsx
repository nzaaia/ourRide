import { createContext, useState, useContext } from 'react';
import { initialMockData } from '../mockData';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('guest');
  const [user, setUser] = useState(null);
  const [data, setData] = useState(initialMockData);
  const [activeRentals, setActiveRentals] = useState([]);
  const [activePassengerRides, setActivePassengerRides] = useState([]);
  const [messages, setMessages] = useState([]);

  // === Auth ===
  const login = (selectedRole = 'renter') => {
    setIsAuthenticated(true);
    setRole(selectedRole);
    setUser({ id: 'u1', name: 'Nazia Putul', avatar: 'https://i.pravatar.cc/150?u=nazia', email: 'nazia@example.com' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole('guest');
    setUser(null);
    setActiveRentals([]);
    setActivePassengerRides([]);
  };

  const toggleRole = (newRole) => {
    if (!isAuthenticated) return;
    setRole(newRole);
  };

  // === Listings ===
  const addListing = (listing) => setData(prev => ({ ...prev, listings: [...prev.listings, listing] }));

  const updateListing = (id, updates) => setData(prev => ({
    ...prev,
    listings: prev.listings.map(l => l.id === id ? { ...l, ...updates } : l)
  }));

  // === Booking Requests (Owner side) ===
  const addBookingRequest = (req) => setData(prev => ({ ...prev, incomingRequests: [...prev.incomingRequests, req] }));

  const updateBookingStatus = (id, status) => setData(prev => ({
    ...prev,
    incomingRequests: prev.incomingRequests.map(r => r.id === id ? { ...r, status } : r)
  }));

  // === Saved Bikes ===
  const toggleSavedBike = (id) => setData(prev => {
    const isSaved = prev.savedBikes.includes(id);
    return { ...prev, savedBikes: isSaved ? prev.savedBikes.filter(b => b !== id) : [...prev.savedBikes, id] };
  });

  // === Rentals ===
  const startRental = (bike, hours) => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);
    setActiveRentals(prev => [...prev, { ...bike, endTime, bookedHours: hours }]);
    updateListing(bike.id, { status: 'active', isAvailable: false });
  };

  const endRental = (bikeId) => {
    setActiveRentals(prev => prev.filter(r => r.id !== bikeId));
    updateListing(bikeId, { status: 'available', isAvailable: true });
  };

  // === Passenger Rides ===
  // Passenger submits a ride request (seen by renters who have active bike)
  const submitRideRequest = (pickup, dropoff, fare) => {
    const rideReq = {
      id: `ride_${Date.now()}`,
      passengerName: user?.name || 'Guest',
      passengerAvatar: user?.avatar || 'https://i.pravatar.cc/150?u=default',
      passengerRating: data.userRating,
      pickup,
      dropoff,
      estimatedFare: fare,
      estimatedTime: '20 min',
      time: 'Now',
      status: 'open',
      counterOffers: []
    };
    setData(prev => ({ ...prev, availableRideRequests: [...prev.availableRideRequests, rideReq] }));
    return rideReq.id;
  };

  // Renter makes a counter offer on a passenger's ride
  const makeCounterOffer = (rideId, offerFare, renterName) => {
    setData(prev => ({
      ...prev,
      availableRideRequests: prev.availableRideRequests.map(r =>
        r.id === rideId
          ? { ...r, status: 'counter_offered', counterOffer: { fare: offerFare, renterName } }
          : r
      )
    }));
  };

  // Passenger accepts a counter offer or the original, ride begins
  const acceptPassengerRide = (rideId) => {
    const ride = data.availableRideRequests.find(r => r.id === rideId);
    if (ride) {
      setActivePassengerRides(prev => [...prev, { ...ride, status: 'active' }]);
      setData(prev => ({
        ...prev,
        availableRideRequests: prev.availableRideRequests.filter(r => r.id !== rideId)
      }));
    }
  };

  // === Messages ===
  const addMessage = (chatId, text, senderId) => {
    const newMsg = { id: Date.now(), chatId, text, senderId, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated, role, user, data,
      activeRentals, activePassengerRides, messages,
      toggleRole, logout, login,
      addListing, updateListing,
      addBookingRequest, updateBookingStatus,
      toggleSavedBike,
      startRental, endRental,
      submitRideRequest, makeCounterOffer, acceptPassengerRide,
      addMessage
    }}>
      {children}
    </AuthContext.Provider>
  );
};
