export const initialMockData = {
  listings: [
    {
      id: 'v1',
      ownerId: 'u2',
      vehicleName: 'Yamaha R15 V3',
      model: 'R15 V3',
      make: 'Yamaha',
      regNumber: 'DHA-LA-11-2233',
      location: 'Banani, Dhaka',
      hourlyRate: 150,
      wearTearRate: 20,
      isAvailable: true,
      autoAccept: false,
      maxRadiusKm: 15,
      rating: 4.9,
      ownerName: 'Rahim',
      ownerAvatar: 'https://i.pravatar.cc/150?u=rahim',
      image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Well maintained, smooth ride. Helmet included.',
      status: 'available' // available, active, in_garage
    },
    {
      id: 'v2',
      ownerId: 'u1', // Belongs to our logged-in user
      vehicleName: 'Suzuki Gixxer SF',
      model: 'Gixxer SF',
      make: 'Suzuki',
      regNumber: 'DHA-HA-55-9988',
      location: 'Dhanmondi, Dhaka',
      hourlyRate: 120,
      wearTearRate: 15,
      isAvailable: true,
      autoAccept: true,
      maxRadiusKm: 20,
      rating: 4.7,
      ownerName: 'Nazia Putul',
      ownerAvatar: 'https://i.pravatar.cc/150?u=nazia',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Perfect for city commuting.',
      status: 'active'
    }
  ],
  incomingRequests: [
    {
      id: 'req1',
      vehicleId: 'v2',
      renterName: 'Jamil',
      renterAvatar: 'https://i.pravatar.cc/150?u=jamil',
      pickupLocation: 'Dhanmondi, Dhaka',
      estimatedDuration: 3,
      estimatedFare: 405, // (120+15)*3
      status: 'pending' // pending, accepted, rejected
    }
  ],
  savedBikes: ['v1'],
  pastTrips: 12,
  userRating: 4.8,
  totalEarnings: 4500,
  recentEarnings: [
    { id: 'e1', date: '2026-06-25', scooter: 'Suzuki Gixxer SF', renter: 'Karim', hours: 2, amount: 270 },
    { id: 'e2', date: '2026-06-20', scooter: 'Suzuki Gixxer SF', renter: 'Sajib', hours: 4, amount: 540 }
  ],
  pastRatings: [
    { id: 'r1', renter: 'Karim', avatar: 'https://i.pravatar.cc/150?u=karim', vehicle: 'Suzuki Gixxer SF', score: 5, date: '2026-06-25' },
    { id: 'r2', renter: 'Sajib', avatar: 'https://i.pravatar.cc/150?u=sajib', vehicle: 'Suzuki Gixxer SF', score: 4, date: '2026-06-20' }
  ],
  availableRideRequests: [
    {
      id: 'ride1',
      passengerName: 'Fahim',
      passengerAvatar: 'https://i.pravatar.cc/150?u=fahim',
      pickup: 'Uttara Sector 11',
      dropoff: 'Gulshan 2 Circle',
      estimatedFare: 200,
      time: 'Today, 09:00 AM'
    }
  ]
};
