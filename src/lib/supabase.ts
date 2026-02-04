import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Real-time subscriptions helper
export function subscribeToBoxUpdates(
  boxId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`box-${boxId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'boxes',
        filter: `id=eq.${boxId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToContributions(
  boxId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`contributions-${boxId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'contributions',
        filter: `box_id=eq.${boxId}`,
      },
      callback
    )
    .subscribe();
}
