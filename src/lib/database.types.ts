export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
export type BoxStatus = 'FUNDING' | 'READY' | 'BREAKING' | 'COMPLETED';
export type TransactionType = 'PURCHASE' | 'CONTRIBUTION' | 'REFUND' | 'PERK_BONUS';
export type UserRank = 'INITIATE' | 'BREAKER' | 'SYNDICATE' | 'PROTOCOL';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url: string | null;
          coins: number;
          rank: UserRank;
          total_contributed: number;
          nft_count: number;
          vip_access: boolean;
          wallet_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          avatar_url?: string | null;
          coins?: number;
          rank?: UserRank;
          total_contributed?: number;
          nft_count?: number;
          vip_access?: boolean;
          wallet_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          avatar_url?: string | null;
          coins?: number;
          rank?: UserRank;
          total_contributed?: number;
          nft_count?: number;
          vip_access?: boolean;
          wallet_address?: string | null;
          created_at?: string;
        };
      };
      boxes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string;
          target_price: number;
          current_raised: number;
          status: BoxStatus;
          contributors_count: number;
          scheduled_break: string | null;
          stream_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url: string;
          target_price: number;
          current_raised?: number;
          status?: BoxStatus;
          contributors_count?: number;
          scheduled_break?: string | null;
          stream_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string;
          target_price?: number;
          current_raised?: number;
          status?: BoxStatus;
          contributors_count?: number;
          scheduled_break?: string | null;
          stream_url?: string | null;
          created_at?: string;
        };
      };
      contributions: {
        Row: {
          id: string;
          user_id: string;
          box_id: string;
          amount: number;
          multiplier: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          box_id: string;
          amount: number;
          multiplier?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          box_id?: string;
          amount?: number;
          multiplier?: number;
          created_at?: string;
        };
      };
      nfts: {
        Row: {
          id: string;
          token_id: number;
          name: string;
          image_url: string;
          rarity: Rarity;
          perk_type: string;
          perk_value: Json;
          owner_id: string | null;
          minted_at: string | null;
          is_genesis: boolean;
        };
        Insert: {
          id?: string;
          token_id: number;
          name: string;
          image_url: string;
          rarity: Rarity;
          perk_type: string;
          perk_value: Json;
          owner_id?: string | null;
          minted_at?: string | null;
          is_genesis?: boolean;
        };
        Update: {
          id?: string;
          token_id?: number;
          name?: string;
          image_url?: string;
          rarity?: Rarity;
          perk_type?: string;
          perk_value?: Json;
          owner_id?: string | null;
          minted_at?: string | null;
          is_genesis?: boolean;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: TransactionType;
          amount: number;
          reference_id: string | null;
          stripe_payment_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: TransactionType;
          amount: number;
          reference_id?: string | null;
          stripe_payment_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: TransactionType;
          amount?: number;
          reference_id?: string | null;
          stripe_payment_id?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      pack_openings: {
        Row: {
          id: string;
          user_id: string;
          pack_tier: number;
          nfts_received: string[];
          opened_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pack_tier: number;
          nfts_received: string[];
          opened_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pack_tier?: number;
          nfts_received?: string[];
          opened_at?: string;
        };
      };
    };
  };
}
