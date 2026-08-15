import { supabase } from './supabaseClient';

export const newId = (prefix) =>
  `${prefix}_${typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 8)}`;

// ---------------------------------------------------------------------------
// Row -> frontend shape mappers (single snake_case -> camelCase layer)
// ---------------------------------------------------------------------------
const mapListing = (r) => ({
  id: r.id,
  ownerId: r.owner_id,
  vehicleName: r.vehicle_name,
  model: r.model,
  make: r.make,
  regNumber: r.reg_number,
  location: r.location,
  exactLocation: r.exact_location || null,
  hourlyRate: Number(r.hourly_rate),
  wearTearRate: Number(r.wear_tear_rate),
  isAvailable: r.is_available,
  autoAccept: r.auto_accept,
  maxRadiusKm: Number(r.max_radius_km),
  rating: Number(r.rating),
  totalTrips: Number(r.total_trips),
  ownerName: r.owner_name,
  ownerAvatar: r.owner_avatar,
  image: r.image,
  description: r.description,
  status: r.status,
  createdAt: r.created_at,
  availableDays: r.available_days || [],
  availableFrom: r.available_from,
  availableTo: r.available_to,
  totalBikeEarnings: Number(r.total_bike_earnings),
});

const mapOwnerReq = (r) => ({
  id: r.request_id,
  vehicleId: r.vehicle_id,
  renterName: r.renter_name,
  renterAvatar: r.renter_avatar,
  renterRating: r.renter_rating,
  renterPastRides: r.renter_past_rides,
  renterPhone: r.renter_phone,
  renterNid: r.renter_nid,
  pickupLocation: r.pickup_location,
  estimatedDuration: r.hours,
  estimatedFare: Number(r.estimated_fare),
  totalFare: Number(r.total_fare),
  status: r.status,
  bikeStatus: r.bike_status,
  tripStartedAt: r.started_at,
  acceptedAt: r.accepted_at,
  locationRevealed: r.location_revealed,
  beforePhoto: r.before_photo,
  afterPhoto: r.after_photo,
  createdAt: r.created_at,
});

const mapRenterReq = (r) => ({
  id: r.id,
  requestId: r.request_id,
  vehicleId: r.vehicle_id,
  vehicleName: r.vehicle_name,
  vehicleImage: r.vehicle_image,
  ownerId: r.owner_id,
  ownerName: r.owner_name,
  ownerAvatar: r.owner_avatar,
  location: r.pickup_location,
  exactLocation: r.exact_location || null,
  selectedDay: r.selected_day,
  selectedTime: r.selected_time,
  hours: r.hours,
  purpose: r.purpose,
  estimatedFare: Number(r.estimated_fare),
  totalFare: Number(r.total_fare),
  status: r.status,
  bikeStatus: r.bike_status,
  startedAt: r.started_at,
  acceptedAt: r.accepted_at,
  locationRevealed: r.location_revealed,
  beforePhoto: r.before_photo,
  afterPhoto: r.after_photo,
  canFindPassengers: r.can_find_passengers,
  createdAt: r.created_at,
});

const mapRide = (r) => ({
  id: r.id,
  passengerId: r.passenger_id,
  passengerName: r.passenger_name,
  passengerAvatar: r.passenger_avatar,
  passengerRating: r.passenger_rating,
  pickup: r.pickup,
  dropoff: r.dropoff,
  estimatedFare: Number(r.estimated_fare),
  estimatedTime: r.estimated_time,
  time: r.time,
  status: r.status,
  counterOffer: r.counter_offer || null,
  createdAt: r.created_at,
});

const mapPastTrip = (r) => ({
  id: r.id,
  vehicle: r.vehicle_name,
  vehicleName: r.vehicle_name,
  scooter: r.vehicle_name,
  owner: r.owner,
  ownerAvatar: r.owner_avatar,
  date: r.date,
  startTime: r.date,
  hours: Number(r.hours),
  duration: Number(r.hours),
  totalFare: Number(r.total_fare),
  fare: Number(r.total_fare),
  amount: Number(r.total_fare),
  rating: r.rating,
});

const mapEarning = (r) => ({
  id: r.id,
  date: r.date,
  scooter: r.scooter,
  vehicleId: r.vehicle_id,
  renter: r.renter,
  hours: Number(r.hours),
  amount: Number(r.amount),
});

const mapRating = (r) => ({
  id: r.id,
  rater: r.rater,
  avatar: r.avatar,
  score: r.score,
  comment: r.comment,
  date: r.date,
  vehicle: r.vehicle,
});

const mapMessage = (r) => ({
  id: r.id,
  chatId: r.chat_id,
  text: r.text,
  senderId: r.sender_id,
  timestamp: r.created_at,
});

// ---------------------------------------------------------------------------
// Snapshot — everything the frontend needs for the current user
// ---------------------------------------------------------------------------
export async function loadSnapshot(userId) {
  const [
    listingsRes,
    bookingsRes,
    savedRes,
    tripsRes,
    earningsRes,
    ratingsRes,
    ridesRes,
    messagesRes,
  ] = await Promise.all([
    supabase.from('listings').select('*').order('created_at', { ascending: false }),
    supabase.from('bookings').select('*'),
    supabase.from('saved_bikes').select('listing_id').eq('user_id', userId),
    supabase.from('past_trips').select('*').eq('user_id', userId),
    supabase.from('earnings').select('*').eq('user_id', userId),
    supabase.from('ratings').select('*').eq('target_user_id', userId),
    supabase.from('ride_requests').select('*').order('created_at', { ascending: true }),
    supabase.from('messages').select('*').order('created_at', { ascending: true }),
  ]);

  const fail = (name, res) => {
    if (res.error) throw new Error(`${name}: ${res.error.message}`);
  };
  fail('listings', listingsRes);
  fail('bookings', bookingsRes);
  fail('saved_bikes', savedRes);
  fail('past_trips', tripsRes);
  fail('earnings', earningsRes);
  fail('ratings', ratingsRes);
  fail('ride_requests', ridesRes);
  fail('messages', messagesRes);

  const listings = listingsRes.data.map(mapListing);
  const incomingRequests = bookingsRes.data.map(mapOwnerReq);
  const renterBookingRequests = bookingsRes.data
    .filter((r) => r.renter_id === userId)
    .map(mapRenterReq);
  const savedBikes = savedRes.data.map((s) => s.listing_id);
  const pastTrips = tripsRes.data.map(mapPastTrip);
  const recentEarnings = earningsRes.data
    .map(mapEarning)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const totalEarnings = recentEarnings.reduce((sum, e) => sum + e.amount, 0);
  const ratings = ratingsRes.data.map(mapRating);
  const userRating = ratings.length
    ? Math.round((ratings.reduce((s, r) => s + r.score, 0) / ratings.length) * 10) / 10
    : 4.8;

  return {
    data: {
      listings,
      incomingRequests,
      savedBikes,
      pastTrips,
      userRating,
      userRatingBreakdown: ratings,
      totalEarnings,
      recentEarnings,
    pastRatings: ratings,
    availableRideRequests: ridesRes.data
      .filter((r) => r.status === 'open' || r.status === 'counter_offered')
      .map(mapRide),
    activePassengerRides: ridesRes.data
      .filter((r) => r.status === 'accepted' && r.counter_offer?.renterId === userId)
      .map(mapRide),
    myActiveRideRequest: ridesRes.data
      .find((r) => r.passenger_id === userId && r.status === 'accepted') 
      ? mapRide(ridesRes.data.find((r) => r.passenger_id === userId && r.status === 'accepted')) 
      : null,
    },
    renterBookingRequests,
    messages: messagesRes.data.map(mapMessage),
  };
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------
const toListingRow = (l) => ({
  id: l.id,
  owner_id: l.ownerId,
  vehicle_name: l.vehicleName,
  model: l.model,
  make: l.make,
  reg_number: l.regNumber,
  location: l.location,
  exact_location: l.exactLocation,
  hourly_rate: l.hourlyRate,
  wear_tear_rate: l.wearTearRate,
  is_available: l.isAvailable,
  auto_accept: l.autoAccept,
  max_radius_km: l.maxRadiusKm,
  rating: l.rating ?? 0,
  total_trips: l.totalTrips ?? 0,
  owner_name: l.ownerName,
  owner_avatar: l.ownerAvatar,
  image: l.image,
  description: l.description,
  status: l.status || 'available',
  created_at: l.createdAt || new Date().toISOString(),
  available_days: l.availableDays || [],
  available_from: l.availableFrom,
  available_to: l.availableTo,
  total_bike_earnings: l.totalBikeEarnings ?? 0,
});

export async function apiCreateListing(listing) {
  const { data, error } = await supabase.from('listings').insert(toListingRow(listing)).select().single();
  if (error) throw error;
  return mapListing(data);
}

const LISTING_PATCH_MAP = {
  hourlyRate: 'hourly_rate',
  wearTearRate: 'wear_tear_rate',
  maxRadiusKm: 'max_radius_km',
  isAvailable: 'is_available',
  autoAccept: 'auto_accept',
  status: 'status',
  availableDays: 'available_days',
  availableFrom: 'available_from',
  availableTo: 'available_to',
  exactLocation: 'exact_location',
  location: 'location',
  hourly_rate: 'hourly_rate',
};

export async function apiUpdateListing(id, updates) {
  const patch = {};
  Object.entries(updates).forEach(([key, value]) => {
    const col = LISTING_PATCH_MAP[key];
    if (col) patch[col] = value;
  });
  if (!Object.keys(patch).length) return;
  const { data, error } = await supabase.from('listings').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return mapListing(data);
}

// ---------------------------------------------------------------------------
// Bookings (single table -> both owner-side and renter-side projections)
// ---------------------------------------------------------------------------
export async function apiCreateBooking({ ownerReq, bookingReq, userId, ownerId }) {
  const row = {
    id: bookingReq.id,
    request_id: ownerReq.id,
    vehicle_id: ownerReq.vehicleId,
    vehicle_name: bookingReq.vehicleName,
    vehicle_image: bookingReq.vehicleImage,
    owner_id: ownerId,
    owner_name: bookingReq.ownerName,
    owner_avatar: bookingReq.ownerAvatar,
    renter_id: userId,
    renter_name: ownerReq.renterName,
    renter_avatar: ownerReq.renterAvatar,
    renter_rating: ownerReq.renterRating,
    renter_past_rides: ownerReq.renterPastRides,
    renter_phone: ownerReq.renterPhone,
    renter_nid: ownerReq.renterNid,
    pickup_location: ownerReq.pickupLocation,
    exact_location: bookingReq.exactLocation,
    selected_day: bookingReq.selectedDay,
    selected_time: bookingReq.selectedTime,
    hours: bookingReq.hours,
    purpose: bookingReq.purpose,
    estimated_fare: ownerReq.estimatedFare,
    total_fare: bookingReq.totalFare,
    status: 'pending',
    bike_status: 'at_garage',
    created_at: ownerReq.createdAt || new Date().toISOString(),
    can_find_passengers: !!bookingReq.canFindPassengers,
  };
  const { data, error } = await supabase.from('bookings').insert(row).select().single();
  if (error) throw error;
  return { ownerReq: mapOwnerReq(data), renterReq: mapRenterReq(data) };
}

export async function apiUpdateBookingStatus(requestId, { status, acceptedAt, locationRevealed }) {
  const patch = { status };
  if (acceptedAt) patch.accepted_at = acceptedAt;
  if (typeof locationRevealed === 'boolean') patch.location_revealed = locationRevealed;
  const { data, error } = await supabase
    .from('bookings')
    .update(patch)
    .eq('request_id', requestId)
    .select()
    .single();
  if (error) throw error;
  return { ownerReq: mapOwnerReq(data), renterReq: mapRenterReq(data) };
}

export async function apiSubmitPhoto(requestId, phase, dataUrl) {
  const patch =
    phase === 'before'
      ? { before_photo: dataUrl, bike_status: 'in_use', started_at: new Date().toISOString() }
      : { after_photo: dataUrl, bike_status: 'returning' };
  const { data, error } = await supabase
    .from('bookings')
    .update(patch)
    .eq('request_id', requestId)
    .select()
    .single();
  if (error) throw error;
  return { ownerReq: mapOwnerReq(data), renterReq: mapRenterReq(data) };
}

export async function apiCompleteTrip({ requestId, booking, listing, renterUserId }) {
  await supabase
    .from('bookings')
    .update({ status: 'completed', bike_status: 'returned' })
    .eq('request_id', requestId);

  const today = new Date().toISOString().slice(0, 10);
  await supabase.from('earnings').insert({
    id: newId('e'),
    user_id: listing.ownerId,
    date: today,
    scooter: booking.vehicleName,
    vehicle_id: booking.vehicleId,
    renter: booking.renterName,
    hours: booking.hours,
    amount: booking.totalFare,
  });
  await supabase.from('past_trips').insert({
    id: newId('trip'),
    user_id: renterUserId,
    vehicle_name: booking.vehicleName,
    owner: listing.ownerName,
    owner_avatar: listing.ownerAvatar,
    date: today,
    hours: booking.hours,
    total_fare: booking.totalFare,
    rating: null,
  });
  await supabase
    .from('listings')
    .update({ status: 'available', is_available: true })
    .eq('id', listing.id);
}

// ---------------------------------------------------------------------------
// Saved bikes
// ---------------------------------------------------------------------------
export async function apiToggleSavedBike(userId, listingId, isCurrentlySaved) {
  if (isCurrentlySaved) {
    const { error } = await supabase
      .from('saved_bikes')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('saved_bikes')
      .insert({ user_id: userId, listing_id: listingId });
    if (error) throw error;
  }
}

// ---------------------------------------------------------------------------
// Ride requests
// ---------------------------------------------------------------------------
export async function apiCreateRideRequest(ride) {
  const { error } = await supabase.from('ride_requests').insert({
    id: ride.id,
    passenger_id: ride.passengerId,
    passenger_name: ride.passengerName,
    passenger_avatar: ride.passengerAvatar,
    passenger_rating: ride.passengerRating,
    pickup: ride.pickup,
    dropoff: ride.dropoff,
    estimated_fare: ride.estimatedFare,
    estimated_time: ride.estimatedTime,
    time: ride.time,
    status: ride.status || 'open',
    created_at: ride.createdAt || new Date().toISOString(),
  });
  if (error) throw error;
}

export async function apiCounterOffer(rideId, fare, renterName, renterId) {
  const { error } = await supabase
    .from('ride_requests')
    .update({ counter_offer: { fare, renterName, renterId }, status: 'counter_offered' })
    .eq('id', rideId);
  if (error) throw error;
}

export async function apiAcceptRide(rideId, renterId) {
  const { data: ride } = await supabase.from('ride_requests').select('counter_offer').eq('id', rideId).single();
  const counterOffer = ride?.counter_offer || {};
  counterOffer.renterId = renterId;

  const { error } = await supabase.from('ride_requests').update({ status: 'accepted', counter_offer: counterOffer }).eq('id', rideId);
  if (error) throw error;
}

export async function apiCompletePassengerRide(rideId) {
  const { error } = await supabase.from('ride_requests').update({ status: 'completed' }).eq('id', rideId);
  if (error) throw error;
}

export async function apiCancelRideRequest(rideId) {
  const { error } = await supabase.from('ride_requests').delete().eq('id', rideId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
export async function apiSendMessage(msg) {
  const { error } = await supabase.from('messages').insert({
    id: msg.id,
    chat_id: msg.chatId,
    text: msg.text,
    sender_id: msg.senderId,
    created_at: msg.timestamp || new Date().toISOString(),
  });
  if (error) throw error;
}
