import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Using any type for now - generate proper types with: npx supabase gen types typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// COIN SYSTEM CONSTANTS
// =============================================
export const COIN_SYSTEM = {
  CONTRIBUTION_AMOUNT: 8, // User pays 8€
  POKEBALLS_RECEIVED: 6,  // User gets 6 pokeballs
  CROWDFUND_AMOUNT: 2,    // 2€ goes to the box
};

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
  amountEuros: number,
  isAnonymous: boolean = false
) {
  // Calculate pokeballs and crowdfund amount based on contribution
  const multiplier = amountEuros / COIN_SYSTEM.CONTRIBUTION_AMOUNT;
  const pokeballsReceived = Math.floor(multiplier * COIN_SYSTEM.POKEBALLS_RECEIVED);
  const crowdfundAmount = multiplier * COIN_SYSTEM.CROWDFUND_AMOUNT;

  const { data, error } = await supabase
    .from('contributions')
    .insert({
      user_id: userId,
      box_id: boxId,
      amount_euros: amountEuros,
      pokeballs_received: pokeballsReceived,
      crowdfund_amount: crowdfundAmount,
      is_anonymous: isAnonymous,
      status: 'PENDING',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeContribution(
  contributionId: string,
  stripePaymentId: string
) {
  const { data, error } = await supabase
    .from('contributions')
    .update({
      status: 'COMPLETED',
      stripe_payment_id: stripePaymentId,
    })
    .eq('id', contributionId)
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
      users (name, username, avatar_url)
    `)
    .eq('box_id', boxId)
    .eq('status', 'COMPLETED')
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

export async function getUserByUsername(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) return null;
  return data;
}

export async function createUser(
  name: string,
  username: string,
  email?: string,
  phone?: string
) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name,
      username,
      email: email || null,
      phone: phone || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserPokeballs(userId: string, newBalance: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ pokeballs: newBalance })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================
// PACK QUERIES
// =============================================

export async function getAvailablePacks() {
  const { data, error } = await supabase
    .from('packs')
    .select('*')
    .eq('is_available', true)
    .order('price_pokeballs', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPackById(id: string) {
  const { data, error } = await supabase
    .from('packs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function purchasePack(userId: string, packId: string) {
  // Get pack details
  const pack = await getPackById(packId);
  if (!pack) throw new Error('Pack not found');

  // Get user's current pokeballs
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  if (user.pokeballs < pack.price_pokeballs) {
    throw new Error('Insufficient pokeballs');
  }

  // Calculate next Friday at 20:00
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  const nextFriday = new Date(now);
  nextFriday.setDate(now.getDate() + daysUntilFriday);
  nextFriday.setHours(20, 0, 0, 0);

  // Create pack purchase
  const { data, error } = await supabase
    .from('pack_purchases')
    .insert({
      user_id: userId,
      pack_id: packId,
      pokeballs_spent: pack.price_pokeballs,
      status: 'PENDING',
      scheduled_stream: nextFriday.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  // Deduct pokeballs from user
  await updateUserPokeballs(userId, user.pokeballs - pack.price_pokeballs);

  return data;
}

export async function getUserPurchases(userId: string) {
  const { data, error } = await supabase
    .from('pack_purchases')
    .select(`
      *,
      packs (name, image_url, set_name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// =============================================
// CARD QUERIES
// =============================================

export async function getUserCards(userId: string) {
  const { data, error } = await supabase
    .from('pack_cards')
    .select('*')
    .eq('user_id', userId)
    .order('obtained_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function listCardForSale(
  cardId: string,
  price: number,
  shippingCost: number = 0
) {
  const commission = price * 0.01; // 1% commission

  const { data: card, error: cardError } = await supabase
    .from('pack_cards')
    .select('user_id')
    .eq('id', cardId)
    .single();

  if (cardError) throw cardError;

  const { data, error } = await supabase
    .from('card_sales')
    .insert({
      card_id: cardId,
      seller_id: card.user_id,
      price,
      commission,
      shipping_cost: shippingCost,
      status: 'ACTIVE',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMarketplaceListings() {
  const { data, error } = await supabase
    .from('card_sales')
    .select(`
      *,
      pack_cards (card_name, card_image_url, rarity),
      users!card_sales_seller_id_fkey (username)
    `)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

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
      metadata: metadata || null,
    });

  if (error) throw error;
}

// =============================================
// NOTIFICATIONS
// =============================================

export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

// =============================================
// REAL-TIME SUBSCRIPTIONS
// =============================================

export function subscribeToBox(
  boxId: string,
  callback: (payload: unknown) => void
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
  callback: (payload: unknown) => void
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
  callback: (payload: unknown) => void
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

export function subscribeToUserNotifications(
  userId: string,
  callback: (payload: unknown) => void
) {
  return supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

// =============================================
// LEADERBOARD
// =============================================

export async function getTopContributors(limit: number = 10) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, username, avatar_url, total_contributed')
    .order('total_contributed', { ascending: false })
    .gt('total_contributed', 0)
    .limit(limit);

  if (error) throw error;
  return data;
}
