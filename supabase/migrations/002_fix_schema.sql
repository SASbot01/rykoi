-- =============================================
-- RYŌIKI - FIX SCHEMA
-- Run this to clean and fix the database
-- =============================================

-- =============================================
-- DROP EVERYTHING FIRST (clean slate)
-- =============================================

DROP VIEW IF EXISTS marketplace CASCADE;
DROP VIEW IF EXISTS active_boxes CASCADE;
DROP VIEW IF EXISTS user_dashboard CASCADE;

DROP FUNCTION IF EXISTS list_card_for_sale CASCADE;
DROP FUNCTION IF EXISTS purchase_pack CASCADE;
DROP FUNCTION IF EXISTS complete_contribution CASCADE;
DROP FUNCTION IF EXISTS create_contribution CASCADE;
DROP FUNCTION IF EXISTS calculate_card_sale CASCADE;
DROP FUNCTION IF EXISTS process_pack_purchase CASCADE;
DROP FUNCTION IF EXISTS process_contribution CASCADE;
DROP FUNCTION IF EXISTS update_updated_at CASCADE;

DROP TABLE IF EXISTS activity_feed CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS card_sales CASCADE;
DROP TABLE IF EXISTS pack_cards CASCADE;
DROP TABLE IF EXISTS pack_purchases CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS packs CASCADE;
DROP TABLE IF EXISTS boxes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS pack_status CASCADE;
DROP TYPE IF EXISTS box_status CASCADE;
DROP TYPE IF EXISTS user_rank CASCADE;

-- =============================================
-- CREATE TYPES
-- =============================================

CREATE TYPE user_rank AS ENUM ('INITIATE', 'BREAKER', 'SYNDICATE', 'PROTOCOL');
CREATE TYPE box_status AS ENUM ('FUNDING', 'READY', 'BREAKING', 'COMPLETED', 'CANCELLED');
CREATE TYPE pack_status AS ENUM ('PENDING', 'OPENED', 'SHIPPED', 'DELIVERED');
CREATE TYPE transaction_type AS ENUM ('CONTRIBUTION', 'PACK_PURCHASE', 'REFUND', 'BONUS');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- =============================================
-- USERS TABLE
-- =============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    phone TEXT,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    pokeballs INT DEFAULT 0 CHECK (pokeballs >= 0),
    total_contributed DECIMAL(12,2) DEFAULT 0,
    total_packs_bought INT DEFAULT 0,
    rank user_rank DEFAULT 'INITIATE',
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BOXES TABLE
-- =============================================

CREATE TABLE boxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    target_price DECIMAL(10,2) NOT NULL,
    current_raised DECIMAL(10,2) DEFAULT 0,
    status box_status DEFAULT 'FUNDING',
    contributors_count INT DEFAULT 0,
    scheduled_break TIMESTAMPTZ,
    stream_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PACKS TABLE
-- =============================================

CREATE TABLE packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    price_pokeballs INT NOT NULL,
    set_name TEXT,
    cards_per_pack INT DEFAULT 10,
    is_featured BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CONTRIBUTIONS TABLE
-- =============================================

CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    box_id UUID REFERENCES boxes(id) ON DELETE CASCADE,
    euros_paid DECIMAL(10,2) NOT NULL,
    euros_to_box DECIMAL(10,2) NOT NULL,
    pokeballs_given INT NOT NULL,
    stripe_payment_intent_id TEXT,
    status transaction_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- =============================================
-- PACK PURCHASES TABLE
-- =============================================

CREATE TABLE pack_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pack_id UUID NOT NULL REFERENCES packs(id),
    pokeballs_spent INT NOT NULL,
    status pack_status DEFAULT 'PENDING',
    stream_date TIMESTAMPTZ,
    stream_url TEXT,
    shipping_address TEXT,
    tracking_number TEXT,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ
);

-- =============================================
-- PACK CARDS TABLE
-- =============================================

CREATE TABLE pack_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pack_purchase_id UUID NOT NULL REFERENCES pack_purchases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_name TEXT NOT NULL,
    card_set TEXT,
    card_number TEXT,
    card_rarity TEXT,
    image_url TEXT,
    estimated_value DECIMAL(10,2),
    is_holo BOOLEAN DEFAULT FALSE,
    is_for_sale BOOLEAN DEFAULT FALSE,
    sale_price DECIMAL(10,2),
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CARD SALES TABLE
-- =============================================

CREATE TABLE card_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES pack_cards(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    sale_price DECIMAL(10,2) NOT NULL,
    commission_percent DECIMAL(5,2) DEFAULT 1.00,
    commission_amount DECIMAL(10,2),
    shipping_cost DECIMAL(10,2),
    seller_receives DECIMAL(10,2),
    buyer_name TEXT,
    buyer_email TEXT,
    buyer_address TEXT,
    stripe_payment_id TEXT,
    tracking_number TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ
);

-- =============================================
-- TRANSACTIONS TABLE
-- =============================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    euros_amount DECIMAL(10,2),
    pokeballs_amount INT,
    reference_id UUID,
    reference_type TEXT,
    stripe_payment_intent_id TEXT,
    status transaction_status DEFAULT 'PENDING',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    reference_id UUID,
    reference_type TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACTIVITY FEED TABLE
-- =============================================

CREATE TABLE activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username TEXT,
    event_type TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_boxes_status ON boxes(status);
CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_contributions_box ON contributions(box_id);
CREATE INDEX idx_pack_purchases_user ON pack_purchases(user_id);
CREATE INDEX idx_pack_cards_user ON pack_cards(user_id);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Users: anyone can read and insert, users can update own
CREATE POLICY "Users viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (auth.uid() = id);

-- Boxes: public read
CREATE POLICY "Boxes viewable by everyone" ON boxes FOR SELECT USING (true);

-- Packs: public read
CREATE POLICY "Packs viewable by everyone" ON packs FOR SELECT USING (true);

-- Contributions: public read, auth insert
CREATE POLICY "Contributions viewable by everyone" ON contributions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contributions" ON contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update contributions" ON contributions FOR UPDATE USING (true);

-- Pack purchases: user can see own
CREATE POLICY "Users can view own purchases" ON pack_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own purchases" ON pack_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pack cards: public read
CREATE POLICY "Pack cards viewable by everyone" ON pack_cards FOR SELECT USING (true);
CREATE POLICY "Users can update own cards" ON pack_cards FOR UPDATE USING (auth.uid() = user_id);

-- Card sales: public read
CREATE POLICY "Card sales viewable by everyone" ON card_sales FOR SELECT USING (true);

-- Transactions: user can see own
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Notifications: user can see own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Activity feed: public read, anyone can insert
CREATE POLICY "Activity feed viewable by everyone" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "Anyone can insert activity" ON activity_feed FOR INSERT WITH CHECK (true);

-- =============================================
-- SEED DATA: PACKS
-- =============================================

INSERT INTO packs (name, description, image_url, price_pokeballs, set_name, is_featured, is_available) VALUES
('Prismatic Evolutions', 'Espeon & Umbreon artwork', '/packs/prismatic-evolutions.png', 9, 'Scarlet & Violet', true, true),
('Rising Heroes', 'Premium expansion pack', '/packs/heroes-ascendentes.png', 12, 'Scarlet & Violet', true, true),
('Phantom Flames', 'Mega Charizard X artwork', '/packs/phantom-flames.png', 7, 'XY Series', false, true),
('Obsidian Flames', 'Dark power unleashed', '/packs/black-flame.png', 7, 'Scarlet & Violet', false, true),
('White Flame', 'Pure fire energy', '/packs/white-flame.png', 7, 'XY Series', false, true),
('Mega Evolution', 'Mega Gardevoir artwork', '/packs/mega-gardevoir.png', 7, 'XY Series', false, true);

-- =============================================
-- SEED DATA: BOXES
-- =============================================

INSERT INTO boxes (name, description, image_url, target_price, is_featured, is_trending) VALUES
('Prismatic Evolutions', 'Booster Box — 36 Packs', '/packs/prismatic-evolutions.png', 400.00, true, true),
('Rising Heroes', 'Elite Trainer Box', '/packs/heroes-ascendentes.png', 120.00, false, false),
('Obsidian Flames', 'Booster Box — 36 Packs', '/packs/black-flame.png', 180.00, false, false);

-- =============================================
-- DONE
-- =============================================

SELECT 'Schema fixed and ready!' as status;
