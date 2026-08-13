-- ============================================================
-- OurRide — Supabase setup
-- Creates all tables (mirroring the frontend data contract),
-- permissive RLS policies (POC), realtime publication, and the
-- exact demo seed data. Safe to re-run anytime to reset demo data.
-- ============================================================

DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.ride_requests;
DROP TABLE IF EXISTS public.ratings;
DROP TABLE IF EXISTS public.earnings;
DROP TABLE IF EXISTS public.past_trips;
DROP TABLE IF EXISTS public.saved_bikes;
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.listings;

-- ---------------- listings ----------------
CREATE TABLE public.listings (
  id                  text PRIMARY KEY,
  owner_id            text NOT NULL,
  vehicle_name        text NOT NULL,
  model               text,
  make                text,
  reg_number          text,
  location            text,
  exact_location      jsonb,
  hourly_rate         numeric NOT NULL DEFAULT 0,
  wear_tear_rate      numeric NOT NULL DEFAULT 0,
  is_available        boolean NOT NULL DEFAULT true,
  auto_accept         boolean NOT NULL DEFAULT false,
  max_radius_km       numeric NOT NULL DEFAULT 10,
  rating              numeric NOT NULL DEFAULT 0,
  total_trips         integer NOT NULL DEFAULT 0,
  owner_name          text,
  owner_avatar        text,
  image               text,
  description         text,
  status              text NOT NULL DEFAULT 'available',
  created_at          timestamptz NOT NULL DEFAULT now(),
  available_days      jsonb,
  available_from      text,
  available_to        text,
  total_bike_earnings numeric NOT NULL DEFAULT 0
);

-- ---------------- bookings ----------------
-- Single table powering BOTH the owner-side "incomingRequests"
-- and the renter-side "renterBookingRequests" views.
CREATE TABLE public.bookings (
  id                  text PRIMARY KEY,
  request_id          text NOT NULL,
  vehicle_id          text NOT NULL,
  vehicle_name        text,
  vehicle_image       text,
  owner_id            text,
  owner_name          text,
  owner_avatar        text,
  renter_id           text NOT NULL,
  renter_name         text,
  renter_avatar       text,
  renter_rating       numeric,
  renter_past_rides   integer,
  renter_phone        text,
  renter_nid          text,
  pickup_location     text,
  exact_location      jsonb,
  selected_day        text,
  selected_time       text,
  hours               numeric,
  purpose             text,
  estimated_fare      numeric,
  total_fare          numeric,
  status              text NOT NULL DEFAULT 'pending',
  bike_status         text NOT NULL DEFAULT 'at_garage',
  started_at          timestamptz,
  accepted_at         timestamptz,
  location_revealed   boolean NOT NULL DEFAULT false,
  before_photo        text,
  after_photo         text,
  can_find_passengers boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ---------------- saved_bikes ----------------
CREATE TABLE public.saved_bikes (
  user_id    text NOT NULL,
  listing_id text NOT NULL,
  PRIMARY KEY (user_id, listing_id)
);

-- ---------------- past_trips ----------------
CREATE TABLE public.past_trips (
  id           text PRIMARY KEY,
  user_id      text NOT NULL,
  vehicle_name text,
  owner        text,
  owner_avatar text,
  date         text,
  hours        numeric,
  total_fare   numeric,
  rating       integer
);

-- ---------------- earnings ----------------
CREATE TABLE public.earnings (
  id         text PRIMARY KEY,
  user_id    text NOT NULL,
  date       text,
  scooter    text,
  vehicle_id text,
  renter     text,
  hours      numeric,
  amount     numeric NOT NULL DEFAULT 0
);

-- ---------------- ratings ----------------
CREATE TABLE public.ratings (
  id             text PRIMARY KEY,
  target_user_id text NOT NULL,
  rater          text,
  avatar         text,
  score          integer,
  comment        text,
  date           text,
  vehicle        text
);

-- ---------------- ride_requests ----------------
CREATE TABLE public.ride_requests (
  id              text PRIMARY KEY,
  passenger_id    text,
  passenger_name  text,
  passenger_avatar text,
  passenger_rating numeric,
  pickup          text,
  dropoff         text,
  estimated_fare  numeric,
  estimated_time  text,
  time            text,
  status          text NOT NULL DEFAULT 'open',
  counter_offer   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------- messages ----------------
CREATE TABLE public.messages (
  id         text PRIMARY KEY,
  chat_id    text NOT NULL DEFAULT 'chat1',
  text       text,
  sender_id  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------- RLS (permissive — POC only) ----------------
ALTER TABLE public.listings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_bikes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_trips   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages     ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'listings','bookings','saved_bikes','past_trips','earnings',
    'ratings','ride_requests','messages'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "poc_open_%1$s" ON public.%1$s', t);
    EXECUTE format(
      'CREATE POLICY "poc_open_%1$s" ON public.%1$s FOR ALL TO public USING (true) WITH CHECK (true)',
      t
    );
  END LOOP;
END $$;

-- ---------------- Realtime ----------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ride_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_bikes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ratings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.earnings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.past_trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================================
-- SEED — mirrors frontend/src/mockData.js exactly
-- ============================================================

INSERT INTO public.listings (id, owner_id, vehicle_name, model, make, reg_number,
  location, exact_location, hourly_rate, wear_tear_rate, is_available, auto_accept,
  max_radius_km, rating, total_trips, owner_name, owner_avatar, image, description,
  status, created_at, available_days, available_from, available_to, total_bike_earnings)
VALUES
  ('v3', 'u3', 'Honda CB300R', 'CB300R', 'Honda', 'DHA-CB-33-7744',
   'University Campus – Library',
   '{"lat": 23.8768, "lng": 90.3854, "address": "Library Gate, North Campus, BUET, Dhaka"}',
   180, 25, true, false, 25, 4.8, 15, 'Karim',
   'https://i.pravatar.cc/150?u=karim',
   'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
   'Sporty and fast. Great for longer trips off campus.',
   'available', '2026-08-09T10:00:00Z', '["Mon","Tue","Wed","Thu","Fri"]', '08:00', '20:00', 2700),
  ('v2', 'u1', 'Suzuki Gixxer SF', 'Gixxer SF', 'Suzuki', 'DHA-HA-55-9988',
   'University Campus – Gate B',
   '{"lat": 23.8750, "lng": 90.3833, "address": "Gate B, South Entrance, BUET, Dhaka"}',
   120, 15, true, true, 20, 4.7, 24, 'Nazia Putul',
   'https://i.pravatar.cc/150?u=nazia',
   'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
   'Perfect for city commuting. Auto-accepts bookings – ride instantly!',
   'available', '2026-08-07T14:30:00Z', '["Mon","Tue","Wed","Thu","Fri","Sat"]', '07:00', '22:00', 1215),
  ('v1', 'u2', 'Yamaha R15 V3', 'R15 V3', 'Yamaha', 'DHA-LA-11-2233',
   'University Campus – Gate A',
   '{"lat": 23.8763, "lng": 90.3822, "address": "Gate A, Main Entrance, BUET, Dhaka"}',
   150, 20, true, false, 15, 4.9, 38, 'Rahim',
   'https://i.pravatar.cc/150?u=rahim',
   'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
   'Well maintained, smooth ride. Helmet included. Great for campus commutes.',
   'available', '2026-07-20T09:00:00Z',
   '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]', '06:00', '21:00', 6460);

INSERT INTO public.bookings (id, request_id, vehicle_id, vehicle_name, vehicle_image,
  owner_id, owner_name, owner_avatar, renter_id, renter_name, renter_avatar,
  renter_rating, renter_past_rides, renter_phone, renter_nid, pickup_location,
  exact_location, selected_day, selected_time, hours, purpose, estimated_fare,
  total_fare, status, bike_status, created_at, can_find_passengers)
VALUES
  ('bk_seed1', 'req1', 'v2', 'Suzuki Gixxer SF',
   'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
   'u1', 'Nazia Putul', 'https://i.pravatar.cc/150?u=nazia',
   'ren_jamil', 'Jamil', 'https://i.pravatar.cc/150?u=jamil',
   4.6, 18, '01711223344', '9876543210', 'University Campus – Gate B',
   '{"lat": 23.8750, "lng": 90.3833, "address": "Gate B, South Entrance, BUET, Dhaka"}',
   NULL, NULL, 3, 'personal', 405, 405, 'pending', 'at_garage',
   '2026-08-10T08:00:00Z', false);

INSERT INTO public.saved_bikes (user_id, listing_id) VALUES
  ('u1', 'v1'),
  ('u1', 'v3'),
  ('u_renter', 'v2'),
  ('u_renter', 'v1');

INSERT INTO public.past_trips (id, user_id, vehicle_name, owner, owner_avatar, date, hours, total_fare, rating) VALUES
  ('trip1', 'u1', 'Yamaha R15 V3', 'Rahim', 'https://i.pravatar.cc/150?u=rahim', '2026-07-28', 2, 340, 5),
  ('trip2', 'u1', 'Honda CB300R', 'Karim', 'https://i.pravatar.cc/150?u=karim', '2026-07-15', 3, 615, 4),
  ('trip3', 'u1', 'Yamaha R15 V3', 'Rahim', 'https://i.pravatar.cc/150?u=rahim', '2026-06-30', 1, 170, 5),
  ('trip4', 'u_renter', 'Suzuki Gixxer SF', 'Nazia Putul', 'https://i.pravatar.cc/150?u=nazia', '2026-08-02', 2, 270, 5),
  ('trip5', 'u_renter', 'Yamaha R15 V3', 'Rahim', 'https://i.pravatar.cc/150?u=rahim', '2026-07-18', 1, 170, 4);

INSERT INTO public.earnings (id, user_id, date, scooter, vehicle_id, renter, hours, amount) VALUES
  ('e1', 'u1', '2026-06-25', 'Suzuki Gixxer SF', 'v2', 'Karim', 2, 270),
  ('e2', 'u1', '2026-06-20', 'Suzuki Gixxer SF', 'v2', 'Sajib', 4, 540),
  ('e3', 'u1', '2026-06-10', 'Suzuki Gixxer SF', 'v2', 'Jamil', 3, 405);

INSERT INTO public.ratings (id, target_user_id, rater, avatar, score, comment, date, vehicle) VALUES
  ('r1', 'u1', 'Rahim', 'https://i.pravatar.cc/150?u=rahim', 5, 'Very responsible rider. Returned on time.', '2026-07-28', 'Suzuki Gixxer SF'),
  ('r2', 'u1', 'Karim', 'https://i.pravatar.cc/150?u=karim', 5, 'Great passenger, very communicative.', '2026-07-15', 'Suzuki Gixxer SF'),
  ('r3', 'u1', 'Rahim', 'https://i.pravatar.cc/150?u=rahim', 4, 'Good experience overall.', '2026-06-30', 'Suzuki Gixxer SF'),
  ('r4', 'u1', 'Sajib', 'https://i.pravatar.cc/150?u=sajib', 5, 'Smooth ride, punctual owner.', '2026-06-20', 'Suzuki Gixxer SF'),
  ('r5', 'u_renter', 'Rahim', 'https://i.pravatar.cc/150?u=rahim', 5, 'Great bike, perfectly maintained!', '2026-08-02', 'Suzuki Gixxer SF'),
  ('r6', 'u_renter', 'Nazia Putul', 'https://i.pravatar.cc/150?u=nazia', 4, 'Smooth handover, punctual renter.', '2026-07-18', 'Yamaha R15 V3'),
  ('r7', 'u_passenger', 'Sadia', 'https://i.pravatar.cc/150?u=sadia', 5, 'Very polite passenger.', '2026-08-05', NULL),
  ('r8', 'u_passenger', 'Fahim', 'https://i.pravatar.cc/150?u=fahim', 4, 'Easy to coordinate with.', '2026-07-22', NULL);

INSERT INTO public.ride_requests (id, passenger_id, passenger_name, passenger_avatar,
  passenger_rating, pickup, dropoff, estimated_fare, estimated_time, time, status, created_at)
VALUES
  ('ride1', 'ren_fahim', 'Fahim', 'https://i.pravatar.cc/150?u=fahim',
   4.5, 'Uttara Sector 11', 'Gulshan 2 Circle', 200, '18 min', 'Now', 'open', '2026-08-10T09:00:00Z'),
  ('ride2', 'ren_sadia', 'Sadia', 'https://i.pravatar.cc/150?u=sadia',
   4.9, 'Mirpur 10', 'Dhanmondi 27', 180, '22 min', 'Now', 'open', '2026-08-10T09:05:00Z');

INSERT INTO public.messages (id, chat_id, text, sender_id, created_at) VALUES
  ('m1', 'chat1', 'Hi! I am on my way to Gate B.', 'other-user', '2026-08-10T10:00:00Z'),
  ('m2', 'chat1', 'Great, I will be there in 5 minutes.', 'u1', '2026-08-10T10:01:00Z');
