export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
export type BoxStatus = 'FUNDING' | 'READY' | 'BREAKING' | 'COMPLETED';
export type ContributionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PurchaseStatus = 'PENDING' | 'CONFIRMED' | 'OPENED' | 'SHIPPED';
export type SaleStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED';
export type TransactionType = 'CONTRIBUTION' | 'PACK_PURCHASE' | 'CARD_SALE' | 'PAYOUT' | 'REFUND';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          name: string;
          username: string;
          avatar_url: string | null;
          pokeballs: number;
          total_contributed: number;
          packs_purchased: number;
          cards_obtained: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          name: string;
          username: string;
          avatar_url?: string | null;
          pokeballs?: number;
          total_contributed?: number;
          packs_purchased?: number;
          cards_obtained?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          name?: string;
          username?: string;
          avatar_url?: string | null;
          pokeballs?: number;
          total_contributed?: number;
          packs_purchased?: number;
          cards_obtained?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      boxes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string;
          set_name: string | null;
          target_price: number;
          current_raised: number;
          status: BoxStatus;
          contributors_count: number;
          scheduled_break: string | null;
          stream_url: string | null;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url: string;
          set_name?: string | null;
          target_price: number;
          current_raised?: number;
          status?: BoxStatus;
          contributors_count?: number;
          scheduled_break?: string | null;
          stream_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string;
          set_name?: string | null;
          target_price?: number;
          current_raised?: number;
          status?: BoxStatus;
          contributors_count?: number;
          scheduled_break?: string | null;
          stream_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      packs: {
        Row: {
          id: string;
          name: string;
          set_name: string;
          image_url: string;
          price_pokeballs: number;
          cards_per_pack: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          set_name: string;
          image_url: string;
          price_pokeballs: number;
          cards_per_pack?: number;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          set_name?: string;
          image_url?: string;
          price_pokeballs?: number;
          cards_per_pack?: number;
          is_available?: boolean;
          created_at?: string;
        };
      };
      contributions: {
        Row: {
          id: string;
          user_id: string;
          box_id: string;
          amount_euros: number;
          pokeballs_received: number;
          crowdfund_amount: number;
          status: ContributionStatus;
          stripe_payment_id: string | null;
          is_anonymous: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          box_id: string;
          amount_euros: number;
          pokeballs_received: number;
          crowdfund_amount: number;
          status?: ContributionStatus;
          stripe_payment_id?: string | null;
          is_anonymous?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          box_id?: string;
          amount_euros?: number;
          pokeballs_received?: number;
          crowdfund_amount?: number;
          status?: ContributionStatus;
          stripe_payment_id?: string | null;
          is_anonymous?: boolean;
          created_at?: string;
        };
      };
      pack_purchases: {
        Row: {
          id: string;
          user_id: string;
          pack_id: string;
          pokeballs_spent: number;
          status: PurchaseStatus;
          scheduled_stream: string | null;
          opened_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pack_id: string;
          pokeballs_spent: number;
          status?: PurchaseStatus;
          scheduled_stream?: string | null;
          opened_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pack_id?: string;
          pokeballs_spent?: number;
          status?: PurchaseStatus;
          scheduled_stream?: string | null;
          opened_at?: string | null;
          created_at?: string;
        };
      };
      pack_cards: {
        Row: {
          id: string;
          purchase_id: string;
          user_id: string;
          card_name: string;
          card_image_url: string | null;
          card_number: string | null;
          rarity: string | null;
          is_holo: boolean;
          estimated_value: number | null;
          obtained_at: string;
        };
        Insert: {
          id?: string;
          purchase_id: string;
          user_id: string;
          card_name: string;
          card_image_url?: string | null;
          card_number?: string | null;
          rarity?: string | null;
          is_holo?: boolean;
          estimated_value?: number | null;
          obtained_at?: string;
        };
        Update: {
          id?: string;
          purchase_id?: string;
          user_id?: string;
          card_name?: string;
          card_image_url?: string | null;
          card_number?: string | null;
          rarity?: string | null;
          is_holo?: boolean;
          estimated_value?: number | null;
          obtained_at?: string;
        };
      };
      card_sales: {
        Row: {
          id: string;
          card_id: string;
          seller_id: string;
          buyer_id: string | null;
          price: number;
          commission: number;
          shipping_cost: number;
          status: SaleStatus;
          sold_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          seller_id: string;
          buyer_id?: string | null;
          price: number;
          commission?: number;
          shipping_cost?: number;
          status?: SaleStatus;
          sold_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string;
          seller_id?: string;
          buyer_id?: string | null;
          price?: number;
          commission?: number;
          shipping_cost?: number;
          status?: SaleStatus;
          sold_at?: string | null;
          created_at?: string;
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
          status: TransactionStatus;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: TransactionType;
          amount: number;
          reference_id?: string | null;
          stripe_payment_id?: string | null;
          status?: TransactionStatus;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: TransactionType;
          amount?: number;
          reference_id?: string | null;
          stripe_payment_id?: string | null;
          status?: TransactionStatus;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
      };
      activity_feed: {
        Row: {
          id: string;
          user_id: string | null;
          username: string;
          event_type: string;
          message: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          username: string;
          event_type: string;
          message: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          username?: string;
          event_type?: string;
          message?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      user_dashboard: {
        Row: {
          id: string;
          name: string;
          username: string;
          pokeballs: number;
          total_contributed: number;
          packs_purchased: number;
          cards_obtained: number;
          pending_packs: number;
        };
      };
      active_boxes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string;
          target_price: number;
          current_raised: number;
          progress_percent: number;
          contributors_count: number;
          status: BoxStatus;
          scheduled_break: string | null;
        };
      };
      marketplace: {
        Row: {
          id: string;
          card_name: string;
          card_image_url: string | null;
          rarity: string | null;
          price: number;
          commission: number;
          shipping_cost: number;
          total_price: number;
          seller_username: string;
        };
      };
    };
    Functions: {
      create_contribution: {
        Args: {
          p_user_id: string;
          p_box_id: string;
          p_amount_euros: number;
        };
        Returns: string;
      };
      complete_contribution: {
        Args: {
          p_contribution_id: string;
          p_stripe_payment_id: string;
        };
        Returns: boolean;
      };
      purchase_pack: {
        Args: {
          p_user_id: string;
          p_pack_id: string;
        };
        Returns: string;
      };
      list_card_for_sale: {
        Args: {
          p_card_id: string;
          p_price: number;
          p_shipping_cost: number;
        };
        Returns: string;
      };
    };
  };
}
