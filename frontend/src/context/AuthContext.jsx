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
  const [renterBookingRequests, setRenterBookingRequests] = useState([]);
  const [activePassengerRides, setActivePassengerRides] = useState([]);
  const [messages, setMessages] = useState([]);

  // === Auth ===
  const login = (selectedRole = 'renter') => {
    setIsAuthenticated(true);
    setRole(selectedRole);
    setUser({
      id: 'u1',
      name: 'Nazia Putul',
      avatar: 'https://i.pravatar.cc/150?u=nazia',
      email: 'nazia@example.com',
      phone: '01712345678',
      nid: '9876543210123',
      registeredAt: '2025-01-15T10:00:00Z',
      userId: 'USR-00123'
    });
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
  const addListing = (listing) => setData(prev => ({
    ...prev,
    listings: [listing, ...prev.listings] // newest first
  }));

  const updateListing = (id, updates) => setData(prev => ({
    ...prev,
    listings: prev.listings.map(l => l.id === id ? { ...l, ...updates } : l)
  }));

  // === Booking Requests (Owner side) ===
  const addBookingRequest = (req) => setData(prev => ({
    ...prev,
    incomingRequests: [req, ...prev.incomingRequests]
  }));

  const updateBookingStatus = (id, status) => setData(prev => ({
    ...prev,
    incomingRequests: prev.incomingRequests.map(r => r.id === id ? { ...r, status } : r)
  }));

  // Accept booking: reveals exact location to renter + records timestamp
  const acceptBookingRequest = (reqId) => {
    const acceptedAt = new Date().toISOString();
    setData(prev => ({
      ...prev,
      incomingRequests: prev.incomingRequests.map(r =>
        r.id === reqId
          ? { ...r, status: 'accepted', locationRevealed: true, acceptedAt }
          : r
      )
    }));
    // Sync renter's side — renter uses requestId = sharedId = owner's req.id
    setRenterBookingRequests(prev => prev.map(r =>
      r.requestId === reqId
        ? { ...r, status: 'accepted', locationRevealed: true, acceptedAt }
        : r
    ));
  };

  // Renter submits before photo → trip starts (in_use)
  const submitBeforePhoto = (reqId, photoDataUrl) => {
    const tripStartedAt = new Date().toISOString();
    let vehicleId = null;
    setRenterBookingRequests(prev => {
      const updated = prev.map(r => {
        if (r.requestId === reqId || r.id === reqId) {
          vehicleId = r.vehicleId;
          return { ...r, bikeStatus: 'in_use', beforePhoto: photoDataUrl, tripStartedAt };
        }
        return r;
      });
      return updated;
    });
    setData(prev => ({
      ...prev,
      incomingRequests: prev.incomingRequests.map(r =>
        r.id === reqId ? { ...r, bikeStatus: 'in_use', tripStartedAt } : r
      )
    }));
    if (vehicleId) {
      setData(prev => ({
        ...prev,
        listings: prev.listings.map(l =>
          l.id === vehicleId ? { ...l, status: 'active', isAvailable: false } : l
        )
      }));
    }
  };

  // Renter submits after photo → returning state, triggers payment
  const submitAfterPhoto = (reqId, photoDataUrl) => {
    setRenterBookingRequests(prev => prev.map(r =>
      (r.requestId === reqId || r.id === reqId)
        ? { ...r, bikeStatus: 'returning', afterPhoto: photoDataUrl }
        : r
    ));
    setData(prev => ({
      ...prev,
      incomingRequests: prev.incomingRequests.map(r =>
        r.id === reqId ? { ...r, bikeStatus: 'returning' } : r
      )
    }));
  };

  // Renter pays → trip complete
  const completeTrip = (reqId) => {
    let vehicleId = null;
    setRenterBookingRequests(prev => prev.map(r => {
      if (r.requestId === reqId || r.id === reqId) {
        vehicleId = r.vehicleId;
        return { ...r, status: 'completed', bikeStatus: 'returned' };
      }
      return r;
    }));
    setData(prev => ({
      ...prev,
      incomingRequests: prev.incomingRequests.map(r =>
        r.id === reqId ? { ...r, status: 'completed', bikeStatus: 'returned' } : r
      )
    }));
    if (vehicleId) {
      setData(prev => ({
        ...prev,
        listings: prev.listings.map(l =>
          l.id === vehicleId ? { ...l, status: 'available', isAvailable: true } : l
        )
      }));
    }
  };

  // === Saved Bikes ===
  const toggleSavedBike = (id) => setData(prev => {
    const isSaved = prev.savedBikes.includes(id);
    return { ...prev, savedBikes: isSaved ? prev.savedBikes.filter(b => b !== id) : [...prev.savedBikes, id] };
  });

  // === Rentals ===
  const addRenterBookingRequest = (req) => {
    setRenterBookingRequests(prev => [req, ...prev]);
  };

  const updateRenterBookingStatus = (reqId, status) => {
    setRenterBookingRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
  };

  const startRental = (bike, hours, purpose = 'personal') => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);
    setActiveRentals(prev => [...prev, { ...bike, endTime, bookedHours: hours, purpose }]);
    updateListing(bike.id, { status: 'active', isAvailable: false });
  };

  const endRental = (bikeId) => {
    setActiveRentals(prev => prev.filter(r => r.id !== bikeId));
    updateListing(bikeId, { status: 'available', isAvailable: true });
  };

  // === Passenger Rides ===
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
      renterBookingRequests,
      toggleRole, logout, login,
      addListing, updateListing,
      addBookingRequest, updateBookingStatus, acceptBookingRequest,
      addRenterBookingRequest, updateRenterBookingStatus,
      submitBeforePhoto, submitAfterPhoto, completeTrip,
      toggleSavedBike,
      startRental, endRental,
      submitRideRequest, makeCounterOffer, acceptPassengerRide,
      addMessage
    }}>
      {children}
    </AuthContext.Provider>
  );
};
