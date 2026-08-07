import { createContext, useState, useContext } from 'react';
import { initialMockData } from '../mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Roles: 'owner', 'renter', 'passenger'
  const [role, setRole] = useState('renter'); // Default to renter for a logged-in user experience
  const [user, setUser] = useState({
    id: 'u1',
    name: 'Nazia Putul',
    avatar: 'https://i.pravatar.cc/150?u=nazia',
    email: 'nazia@example.com'
  });

  // Global Mock Data State
  const [data, setData] = useState(initialMockData);

  const toggleRole = (newRole) => {
    setRole(newRole);
  };

  const logout = () => {
    setUser(null);
  };

  const login = () => {
    setUser({
      id: 'u1',
      name: 'Nazia Putul',
      avatar: 'https://i.pravatar.cc/150?u=nazia',
      email: 'nazia@example.com'
    });
  }

  // Helpers to mutate mock data
  const addListing = (listing) => setData(prev => ({...prev, listings: [...prev.listings, listing]}));
  const updateListing = (id, updates) => setData(prev => ({
    ...prev,
    listings: prev.listings.map(l => l.id === id ? { ...l, ...updates } : l)
  }));
  const addBookingRequest = (req) => setData(prev => ({...prev, incomingRequests: [...prev.incomingRequests, req]}));
  const updateBookingStatus = (id, status) => setData(prev => ({
    ...prev,
    incomingRequests: prev.incomingRequests.map(r => r.id === id ? { ...r, status } : r)
  }));
  const toggleSavedBike = (id) => setData(prev => {
    const isSaved = prev.savedBikes.includes(id);
    return {
      ...prev,
      savedBikes: isSaved ? prev.savedBikes.filter(b => b !== id) : [...prev.savedBikes, id]
    }
  });

  return (
    <AuthContext.Provider value={{ 
      role, user, data, toggleRole, logout, login, 
      addListing, updateListing, addBookingRequest, updateBookingStatus, toggleSavedBike 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

