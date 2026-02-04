import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// =============================================
// BOX QUERIES
// =============================================

export async function getActiveBoxes() {
  const { data, error } = await supabase
    .from('boxes')
    .select('*')
    .in('status', ['FUNDING', 'READY', 'BREAKING'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBoxById(id: string) {
  const { data, error } = await supabase
    .from('boxes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getFeaturedBoxes() {
  const { data, error } = await supabase
    .from('boxes')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'FUNDING')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// =============================================
// CONTRIBUTION QUERIES
// =============================================

export async function createContribution(
  userId: string,
  boxId: string,
  amount: number,
  multiplier: number = 1.0,
  isAnonymous: boolean = false
) {
  const { data, error } = await supabase
    .from('contributions')
    .insert({
      user_id: userId,
      box_id: boxId,
      amount,
      multiplier,
      is_anonymous: isAnonymous,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBoxContributions(boxId: string) {
  const { data, error } = await supabase
    .from('contributions')
    .select(`
      *,
      users (username, avatar_url)
    `)
    .eq('box_id', boxId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

// =============================================
// USER QUERIES
// =============================================

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

export async function updateUserCoins(userId: string, newBalance: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ coins: newBalance })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================
// NFT QUERIES
// =============================================

export async function getGenesisCollection() {
  const { data, error } = await supabase
    .from('nft_collection')
    .select('*')
    .eq('is_genesis', true)
    .order('token_id', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getUserNFTs(userId: string) {
  const { data, error } = await supabase
    .from('user_nfts')
    .select(`
      *,
      nft_collection (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// =============================================
// ACTIVITY FEED
// =============================================

export async function getActivityFeed(limit: number = 20) {
  const { data, error } = await supabase
    .from('activity_feed')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function createActivityEvent(
  userId: string | null,
  username: string,
  eventType: string,
  message: string,
  metadata?: Record<string, unknown>
) {
  const { error } = await supabase
    .from('activity_feed')
    .insert({
      user_id: userId,
      username,
      event_type: eventType,
      message,
      metadata,
    });

  if (error) throw error;
}

// =============================================
// REAL-TIME SUBSCRIPTIONS
// =============================================

export function subscribeToBox(
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

export function subscribeToActivityFeed(
  callback: (payload: any) => void
) {
  return supabase
    .channel('activity-feed')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_feed',
      },
      callback
    )
    .subscribe();
}

// =============================================
// PACK OPENING
// =============================================

export async function recordPackOpening(
  userId: string,
  packTier: number,
  cost: number,
  nftIds: string[]
) {
  const { data, error } = await supabase
    .from('pack_openings')
    .insert({
      user_id: userId,
      pack_tier: packTier,
      cost,
      nfts_received: nftIds,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================
// LEADERBOARD
// =============================================

export async function getTopContributors(limit: number = 10) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, avatar_url, total_contributed, rank')
    .order('total_contributed', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
