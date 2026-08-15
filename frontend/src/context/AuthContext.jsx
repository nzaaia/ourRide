import { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { initialMockData } from '../mockData';
import { subscribeToChanges } from '../lib/supabaseClient';
import * as api from '../lib/api';
import { useToast } from '../components/ui/Toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Demo personas — one per role so a two-device demo can show a real
// owner <-> renter flow against the shared marketplace.
const DEMO_USERS = {
  owner: {
    id: 'u1',
    name: 'Nazia Putul',
    avatar: 'https://i.pravatar.cc/150?u=nazia',
    email: 'nazia@example.com',
    phone: '01712345678',
    nid: '9876543210123',
    registeredAt: '2025-01-15T10:00:00Z',
    userId: 'USR-00123'
  },
  renter: {
    id: 'u_renter',
    name: 'Tahsin Ahmed',
    avatar: 'https://i.pravatar.cc/150?u=tahsin',
    email: 'tahsin@example.com',
    phone: '01823456789',
    nid: '8765432109876',
    registeredAt: '2025-02-10T10:00:00Z',
    userId: 'USR-00124'
  },
  passenger: {
    id: 'u_passenger',
    name: 'Ayesha Rahman',
    avatar: 'https://i.pravatar.cc/150?u=ayesha',
    email: 'ayesha@example.com',
    phone: '01934567890',
    nid: '7654321098765',
    registeredAt: '2025-03-05T10:00:00Z',
    userId: 'USR-00125'
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('guest');
  const [user, setUser] = useState(null);
  const [data, setData] = useState(initialMockData);
  const [activeRentals, setActiveRentals] = useState([]);
  const [renterBookingRequests, setRenterBookingRequests] = useState([]);
  const [activePassengerRides, setActivePassengerRides] = useState([]);
  const [messages, setMessages] = useState([]);

  const toast = useToast();
  const pendingOwnerReqRef = useRef(null);

  const snapshot = useCallback(() => ({
    data,
    renterReqs: renterBookingRequests,
    msgs: messages
  }), [data, renterBookingRequests, messages]);

  const restore = useCallback((snap) => {
    setData(snap.data);
    setRenterBookingRequests(snap.renterReqs);
    setMessages(snap.msgs);
  }, []);

  // Apply an optimistic update, persist it, and revert on failure.
  const sync = useCallback(async (mutate, apiCall, snap) => {
    mutate();
    try {
      await apiCall();
    } catch (err) {
      console.error('Sync failed:', err);
      if (snap) restore(snap);
      if (toast) toast.error('Could not save', 'Your change was not synced. Please try again.');
    }
  }, [restore, toast]);

  // === Server data ===
  const loadServerData = useCallback(async (userId) => {
    try {
      const result = await api.loadSnapshot(userId);
      setData(result.data);
      setRenterBookingRequests(result.renterBookingRequests);
      setMessages(result.messages);
      setActivePassengerRides(result.data.activePassengerRides || []);
    } catch (err) {
      console.error('Failed to load server data:', err);
    }
  }, []);

  // === Auth ===
  const login = (selectedRole = 'renter') => {
    const persona = DEMO_USERS[selectedRole] || DEMO_USERS.renter;
    setIsAuthenticated(true);
    setRole(selectedRole);
    setUser(persona);
    loadServerData(persona.id);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole('guest');
    setUser(null);
    setActiveRentals([]);
    setActivePassengerRides([]);
    setRenterBookingRequests([]);
    setMessages([]);
  };

  const toggleRole = (newRole) => {
    if (!isAuthenticated) return;
    const persona = DEMO_USERS[newRole] || DEMO_USERS.renter;
    setRole(newRole);
    setUser(persona);
    loadServerData(persona.id);
  };

  // Real-time cross-device sync
  useEffect(() => {
    if (!isAuthenticated || !user) return undefined;
    let timer;
    const handleChange = () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadServerData(user.id), 400);
    };
    const unsubscribe = subscribeToChanges(handleChange);
    const onFocus = () => loadServerData(user.id);
    window.addEventListener('focus', onFocus);
    return () => {
      clearTimeout(timer);
      unsubscribe();
      window.removeEventListener('focus', onFocus);
    };
  }, [isAuthenticated, user, loadServerData]);

  // === Listings ===
  const addListing = (listing) => {
    const snap = snapshot();
    const full = {
      ...listing,
      createdAt: listing.createdAt || new Date().toISOString(),
      totalTrips: listing.totalTrips ?? 0,
      rating: listing.rating ?? 0,
      totalBikeEarnings: listing.totalBikeEarnings ?? 0,
      availableDays: listing.availableDays || [],
      exactLocation: listing.exactLocation || null,
      status: listing.status || 'available',
      isAvailable: listing.isAvailable ?? true
    };
    sync(
      () => setData(prev => ({ ...prev, listings: [full, ...prev.listings] })),
      () => api.apiCreateListing(full),
      snap
    );
  };

  const updateListing = (id, updates) => {
    const snap = snapshot();
    sync(
      () => setData(prev => ({
        ...prev,
        listings: prev.listings.map(l => l.id === id ? { ...l, ...updates } : l)
      })),
      () => api.apiUpdateListing(id, updates),
      snap
    );
  };

  // === Booking Requests ===
  const addBookingRequest = (req) => {
    pendingOwnerReqRef.current = req;
    setData(prev => ({ ...prev, incomingRequests: [req, ...prev.incomingRequests] }));
  };

  const addRenterBookingRequest = (req) => {
    const ownerReq = pendingOwnerReqRef.current;
    pendingOwnerReqRef.current = null;
    const snap = snapshot();
    const vehicle = data.listings.find(l => l.id === (ownerReq?.vehicleId || req.vehicleId));
    sync(
      () => setRenterBookingRequests(prev => [req, ...prev]),
      () => api.apiCreateBooking({
        ownerReq,
        bookingReq: req,
        userId: user?.id || DEMO_USERS.renter.id,
        ownerId: vehicle?.ownerId
      }),
      snap
    );
  };

  const updateBookingStatus = (id, status) => {
    const snap = snapshot();
    sync(
      () => setData(prev => ({
        ...prev,
        incomingRequests: prev.incomingRequests.map(r =>
          r.id === id ? { ...r, status } : r
        )
      })),
      () => api.apiUpdateBookingStatus(id, { status }),
      snap
    );
  };

  const acceptBookingRequest = (reqId) => {
    const snap = snapshot();
    const acceptedAt = new Date().toISOString();
    // Find the incoming request to get the vehicleId
    const incomingReq = data.incomingRequests.find(r => r.id === reqId);
    const vehicleId = incomingReq?.vehicleId;
    sync(
      () => {
        setData(prev => {
          const vId = prev.incomingRequests.find(r => r.id === reqId)?.vehicleId || vehicleId;
          return {
            ...prev,
            incomingRequests: prev.incomingRequests.map(r =>
              r.id === reqId
                ? { ...r, status: 'accepted', locationRevealed: true, acceptedAt }
                : r
            ),
            // Mark the listing as active so it shows in Owner Active Bikes
            listings: vId
              ? prev.listings.map(l =>
                  l.id === vId ? { ...l, status: 'active', isAvailable: false } : l
                )
              : prev.listings
          };
        });
        // Update renter's booking request: match by requestId OR id for the accepted one.
        // For all other pending requests from this renter, mark them as 'cancelled' 
        // to ensure only 1 active booking at a time.
        setRenterBookingRequests(prev => prev.map(r => {
          if (r.requestId === reqId || r.id === reqId) {
            return { ...r, status: 'accepted', bikeStatus: 'at_garage', locationRevealed: true, acceptedAt };
          }
          if (r.status === 'pending' || r.status === 'active') {
            return { ...r, status: 'cancelled' };
          }
          return r;
        }));
      },
      () => {
        const p = api.apiUpdateBookingStatus(reqId, { status: 'accepted', acceptedAt, locationRevealed: true });
        // Find vId from the current state rather than the old snapshot just in case
        const vId = data.incomingRequests.find(r => r.id === reqId)?.vehicleId || incomingReq?.vehicleId;
        if (vId) return Promise.all([p, api.apiUpdateListing(vId, { status: 'active', isAvailable: false })]);
        return p;
      },
      snap
    );
  };

  const updateRenterBookingStatus = (reqId, status) => {
    setRenterBookingRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
  };

  const cancelBookingRequest = (reqId) => {
    const snap = snapshot();
    const target = renterBookingRequests.find(r => r.requestId === reqId || r.id === reqId);
    const vehicleId = target?.vehicleId;
    
    sync(
      () => {
        // Cancel the booking for the renter
        setRenterBookingRequests(prev => prev.map(r =>
          (r.requestId === reqId || r.id === reqId) ? { ...r, status: 'cancelled' } : r
        ));
        // Also cancel it for the owner's incoming requests view
        setData(prev => ({
          ...prev,
          incomingRequests: prev.incomingRequests.map(r => 
            (r.id === reqId) ? { ...r, status: 'cancelled' } : r
          ),
          // If the booking was accepted, free up the vehicle again
          listings: (target?.status === 'accepted' && vehicleId)
            ? prev.listings.map(l => l.id === vehicleId ? { ...l, status: 'available', isAvailable: true } : l)
            : prev.listings
        }));
      },
      () => {
        const p = api.apiUpdateBookingStatus(reqId, { status: 'cancelled' });
        if (target?.status === 'accepted' && vehicleId) {
          return Promise.all([p, api.apiUpdateListing(vehicleId, { status: 'available', isAvailable: true })]);
        }
        return p;
      },
      snap
    );
  };

  const submitBeforePhoto = (reqId, photoDataUrl) => {
    const snap = snapshot();
    const tripStartedAt = new Date().toISOString();
    const target = renterBookingRequests.find(r => r.requestId === reqId || r.id === reqId);
    const vehicleId = target?.vehicleId || null;
    sync(
      () => {
        setRenterBookingRequests(prev => prev.map(r =>
          (r.requestId === reqId || r.id === reqId)
            ? { ...r, bikeStatus: 'in_use', beforePhoto: photoDataUrl, tripStartedAt }
            : r
        ));
        setData(prev => ({
          ...prev,
          incomingRequests: prev.incomingRequests.map(r =>
            r.id === reqId ? { ...r, bikeStatus: 'in_use', tripStartedAt } : r
          ),
          listings: vehicleId
            ? prev.listings.map(l => l.id === vehicleId ? { ...l, status: 'active', isAvailable: false } : l)
            : prev.listings
        }));
      },
      async () => {
        await api.apiSubmitPhoto(reqId, 'before', photoDataUrl);
        if (vehicleId) await api.apiUpdateListing(vehicleId, { status: 'active', isAvailable: false });
      },
      snap
    );
  };

  const submitAfterPhoto = (reqId, photoDataUrl) => {
    const snap = snapshot();
    sync(
      () => {
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
      },
      () => api.apiSubmitPhoto(reqId, 'after', photoDataUrl),
      snap
    );
  };

  const completeTrip = (reqId) => {
    const snap = snapshot();
    const target = renterBookingRequests.find(r => r.requestId === reqId || r.id === reqId);
    const listing = target ? data.listings.find(l => l.id === target.vehicleId) : null;
    sync(
      () => {
        setRenterBookingRequests(prev => prev.map(r =>
          (r.requestId === reqId || r.id === reqId)
            ? { ...r, status: 'completed', bikeStatus: 'returned' }
            : r
        ));
        setData(prev => ({
          ...prev,
          incomingRequests: prev.incomingRequests.map(r =>
            r.id === reqId ? { ...r, status: 'completed', bikeStatus: 'returned' } : r
          ),
          listings: listing
            ? prev.listings.map(l =>
                l.id === listing.id ? { ...l, status: 'available', isAvailable: true } : l
              )
            : prev.listings
        }));
      },
      () => api.apiCompleteTrip({
        requestId: reqId,
        booking: { ...target, renterName: target?.renterName || user?.name },
        listing,
        renterUserId: user?.id
      }),
      snap
    );
  };

  // === Request More Time ===
  // Returns { granted, newDuration, newFare }
  const requestMoreTime = (reqId, extraHours = 1) => {
    const target = renterBookingRequests.find(r => r.requestId === reqId || r.id === reqId);
    if (!target) return { granted: false, reason: 'Booking not found' };

    // Check if the vehicle has any accepted booking immediately after this one
    const vehicleId = target.vehicleId;
    const tripEnd = new Date(
      new Date(target.tripStartedAt || target.acceptedAt).getTime() +
      (target.estimatedDuration || target.hours || 1) * 3600000
    );
    const extensionEnd = new Date(tripEnd.getTime() + extraHours * 3600000);

    // Check for conflicting booking (any accepted booking on same vehicle that starts before extensionEnd)
    const conflict = data.incomingRequests.find(r =>
      r.vehicleId === vehicleId &&
      r.id !== reqId &&
      r.status === 'accepted' &&
      r.selectedDay && r.selectedTime
    );

    // No conflict — grant extension
    if (!conflict) {
      const newDuration = (target.estimatedDuration || target.hours || 1) + extraHours;
      const newFare = Math.round(target.totalFare / (target.estimatedDuration || target.hours || 1) * newDuration);
      setRenterBookingRequests(prev => prev.map(r =>
        (r.requestId === reqId || r.id === reqId)
          ? { ...r, estimatedDuration: newDuration, hours: newDuration, totalFare: newFare, timeExtended: true }
          : r
      ));
      setData(prev => ({
        ...prev,
        incomingRequests: prev.incomingRequests.map(r =>
          r.id === reqId ? { ...r, estimatedDuration: newDuration } : r
        )
      }));
      return { granted: true, newDuration, newFare };
    }

    // Has conflict — deny
    return { granted: false, reason: 'Vehicle is booked right after your slot' };
  };

  // === Saved Bikes ===
  const toggleSavedBike = (id) => {
    const snap = snapshot();
    const isSaved = data.savedBikes.includes(id);
    sync(
      () => setData(prev => ({
        ...prev,
        savedBikes: isSaved
          ? prev.savedBikes.filter(b => b !== id)
          : [...prev.savedBikes, id]
      })),
      () => api.apiToggleSavedBike(user?.id || DEMO_USERS.renter.id, id, isSaved),
      snap
    );
  };

  // === Rentals (client-side active rentals) ===
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
      id: api.newId('ride'),
      passengerId: user?.id,
      passengerName: user?.name || 'Guest',
      passengerAvatar: user?.avatar || 'https://i.pravatar.cc/150?u=default',
      passengerRating: data.userRating,
      pickup,
      dropoff,
      estimatedFare: fare,
      estimatedTime: '20 min',
      time: 'Now',
      status: 'open',
      counterOffers: [],
      createdAt: new Date().toISOString()
    };
    sync(
      () => setData(prev => ({ ...prev, availableRideRequests: [...prev.availableRideRequests, rideReq] })),
      () => api.apiCreateRideRequest(rideReq),
      snapshot()
    );
    return rideReq.id;
  };

  const makeCounterOffer = (rideId, offerFare, renterName) => {
    const snap = snapshot();
    sync(
      () => setData(prev => ({
        ...prev,
        availableRideRequests: prev.availableRideRequests.map(r =>
          r.id === rideId
            ? { ...r, status: 'counter_offered', counterOffer: { fare: offerFare, renterName, renterId: user?.id } }
            : r
        )
      })),
      () => api.apiCounterOffer(rideId, offerFare, renterName, user?.id),
      snap
    );
  };

  const acceptPassengerRide = (rideId) => {
    const snap = snapshot();
    const ride = data.availableRideRequests.find(r => r.id === rideId) || data.myActiveRideRequest;
    
    let renterIdToSave = user?.id;
    if (role === 'passenger' && ride?.counterOffer?.renterId) {
      renterIdToSave = ride.counterOffer.renterId;
    }

    sync(
      () => {
        if (role === 'renter' && ride) setActivePassengerRides(prev => [...prev, { ...ride, status: 'active', counterOffer: { ...ride.counterOffer, renterId: user?.id } }]);
        setData(prev => ({
          ...prev,
          availableRideRequests: prev.availableRideRequests.filter(r => r.id !== rideId)
        }));
      },
      () => api.apiAcceptRide(rideId, renterIdToSave),
      snap
    );
  };

  const cancelRideRequest = (rideId) => {
    const snap = snapshot();
    sync(
      () => setData(prev => ({
        ...prev,
        availableRideRequests: prev.availableRideRequests.filter(r => r.id !== rideId)
      })),
      () => api.apiCancelRideRequest(rideId),
      snap
    );
  };

  const completePassengerRide = (rideId) => {
    const snap = snapshot();
    sync(
      () => {
        setActivePassengerRides(prev => prev.filter(r => r.id !== rideId));
      },
      () => api.apiCompletePassengerRide(rideId),
      snap
    );
  };

  // === Messages ===
  const addMessage = (chatId, text, senderId) => {
    const msg = { id: api.newId('msg'), chatId, text, senderId, timestamp: new Date().toISOString() };
    sync(
      () => setMessages(prev => [...prev, msg]),
      () => api.apiSendMessage(msg),
      snapshot()
    );
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated, role, user, data,
      activeRentals, activePassengerRides, messages,
      renterBookingRequests,
      toggleRole, logout, login,
      addListing, updateListing,
      addBookingRequest, updateBookingStatus, acceptBookingRequest,
      addRenterBookingRequest, updateRenterBookingStatus, cancelBookingRequest,
      submitBeforePhoto, submitAfterPhoto, completeTrip, requestMoreTime,
      toggleSavedBike,
      startRental, endRental,
      submitRideRequest, makeCounterOffer, acceptPassengerRide, cancelRideRequest, completePassengerRide,
      addMessage
    }}>
      {children}
    </AuthContext.Provider>
  );
};
