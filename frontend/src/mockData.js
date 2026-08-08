export const initialMockData = {
  listings: [
    {
      id: 'v1',
      ownerId: 'u2',
      vehicleName: 'Yamaha R15 V3',
      model: 'R15 V3',
      make: 'Yamaha',
      regNumber: 'DHA-LA-11-2233',
      location: 'University Campus – Gate A',
      hourlyRate: 150,
      wearTearRate: 20,
      isAvailable: true,
      autoAccept: false,
      maxRadiusKm: 15,
      rating: 4.9,
      totalTrips: 38,
      ownerName: 'Rahim',
      ownerAvatar: 'https://i.pravatar.cc/150?u=rahim',
      image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Well maintained, smooth ride. Helmet included. Great for campus commutes.',
      status: 'available'
    },
    {
      id: 'v2',
      ownerId: 'u1',
      vehicleName: 'Suzuki Gixxer SF',
      model: 'Gixxer SF',
      make: 'Suzuki',
      regNumber: 'DHA-HA-55-9988',
      location: 'University Campus – Gate B',
      hourlyRate: 120,
      wearTearRate: 15,
      isAvailable: true,
      autoAccept: true,
      maxRadiusKm: 20,
      rating: 4.7,
      totalTrips: 24,
      ownerName: 'Nazia Putul',
      ownerAvatar: 'https://i.pravatar.cc/150?u=nazia',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Perfect for city commuting. Auto-accepts bookings – ride instantly!',
      status: 'available'
    },
    {
      id: 'v3',
      ownerId: 'u3',
      vehicleName: 'Honda CB300R',
      model: 'CB300R',
      make: 'Honda',
      regNumber: 'DHA-CB-33-7744',
      location: 'University Campus – Library',
      hourlyRate: 180,
      wearTearRate: 25,
      isAvailable: true,
      autoAccept: false,
      maxRadiusKm: 25,
      rating: 4.8,
      totalTrips: 15,
      ownerName: 'Karim',
      ownerAvatar: 'https://i.pravatar.cc/150?u=karim',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Sporty and fast. Great for longer trips off campus.',
      status: 'available'
    }
  ],
  incomingRequests: [
    {
      id: 'req1',
      vehicleId: 'v2',
      renterName: 'Jamil',
      renterAvatar: 'https://i.pravatar.cc/150?u=jamil',
      renterRating: 4.6,
      renterPastRides: 18,
      pickupLocation: 'University Campus – Gate B',
      estimatedDuration: 3,
      estimatedFare: 405,
      status: 'pending'
    }
  ],
  savedBikes: ['v1', 'v3'],
  pastTrips: [
    { id: 'trip1', vehicle: 'Yamaha R15 V3', owner: 'Rahim', ownerAvatar: 'https://i.pravatar.cc/150?u=rahim', date: '2026-07-28', hours: 2, totalFare: 340, rating: 5 },
    { id: 'trip2', vehicle: 'Honda CB300R', owner: 'Karim', ownerAvatar: 'https://i.pravatar.cc/150?u=karim', date: '2026-07-15', hours: 3, totalFare: 615, rating: 4 },
    { id: 'trip3', vehicle: 'Yamaha R15 V3', owner: 'Rahim', ownerAvatar: 'https://i.pravatar.cc/150?u=rahim', date: '2026-06-30', hours: 1, totalFare: 170, rating: 5 },
  ],
  userRating: 4.8,
  userRatingBreakdown: [
    { rater: 'Rahim', avatar: 'https://i.pravatar.cc/150?u=rahim', score: 5, comment: 'Very responsible rider. Returned on time.', date: '2026-07-28' },
    { rater: 'Karim', avatar: 'https://i.pravatar.cc/150?u=karim', score: 5, comment: 'Great passenger, very communicative.', date: '2026-07-15' },
    { rater: 'Rahim', avatar: 'https://i.pravatar.cc/150?u=rahim', score: 4, comment: 'Good experience overall.', date: '2026-06-30' },
  ],
  totalEarnings: 4500,
  recentEarnings: [
    { id: 'e1', date: '2026-06-25', scooter: 'Suzuki Gixxer SF', renter: 'Karim', hours: 2, amount: 270 },
    { id: 'e2', date: '2026-06-20', scooter: 'Suzuki Gixxer SF', renter: 'Sajib', hours: 4, amount: 540 },
    { id: 'e3', date: '2026-06-10', scooter: 'Suzuki Gixxer SF', renter: 'Jamil', hours: 3, amount: 405 }
  ],
  pastRatings: [
    { id: 'r1', renter: 'Karim', avatar: 'https://i.pravatar.cc/150?u=karim', vehicle: 'Suzuki Gixxer SF', score: 5, comment: 'Great bike, perfectly maintained!', date: '2026-06-25' },
    { id: 'r2', renter: 'Sajib', avatar: 'https://i.pravatar.cc/150?u=sajib', vehicle: 'Suzuki Gixxer SF', score: 4, comment: 'Smooth ride, punctual owner.', date: '2026-06-20' }
  ],
  availableRideRequests: [
    {
      id: 'ride1',
      passengerName: 'Fahim',
      passengerAvatar: 'https://i.pravatar.cc/150?u=fahim',
      passengerRating: 4.5,
      pickup: 'Uttara Sector 11',
      dropoff: 'Gulshan 2 Circle',
      estimatedFare: 200,
      estimatedTime: '18 min',
      time: 'Now',
      status: 'open' // open, counter_offered, accepted
    },
    {
      id: 'ride2',
      passengerName: 'Sadia',
      passengerAvatar: 'https://i.pravatar.cc/150?u=sadia',
      passengerRating: 4.9,
      pickup: 'Mirpur 10',
      dropoff: 'Dhanmondi 27',
      estimatedFare: 180,
      estimatedTime: '22 min',
      time: 'Now',
      status: 'open'
    }
  ]
};
