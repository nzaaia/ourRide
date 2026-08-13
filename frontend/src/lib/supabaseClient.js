import { createClient } from '@supabase/supabase-js';

// POC: values are embedded as fallbacks so the app builds/runs with zero
// env setup. Real projects should set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// (Netlify env vars) which take precedence when present.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zofkpkzvunlplmmhyvzs.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_I5TS9W9kAOO0lXYRVg88ww_MfU1WQVA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const channels = [];
const TABLE_EVENTS = [
  'listings',
  'bookings',
  'saved_bikes',
  'past_trips',
  'earnings',
  'ratings',
  'ride_requests',
  'messages',
];

// Real-time cross-device sync: any insert/update/delete on the key tables
// triggers `onChange`. Debounce in the caller.
export function subscribeToChanges(onChange) {
  const subs = TABLE_EVENTS.map((table) =>
    supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, onChange)
      .subscribe()
  );
  channels.push(...subs);
  return () => {
    subs.forEach((s) => supabase.removeChannel(s));
    channels.splice(0, channels.length, ...channels.filter((c) => !subs.includes(c)));
  };
}
