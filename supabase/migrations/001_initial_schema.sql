-- =============================================
-- RYŌIKI - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CUSTOM TYPES
-- =============================================

DO $$ BEGIN
    CREATE TYPE user_rank AS ENUM ('INITIATE', 'BREAKER', 'SYNDICATE', 'PROTOCOL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE box_status AS ENUM ('FUNDING', 'READY', 'BREAKING', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE nft_rarity AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('COIN_PURCHASE', 'CONTRIBUTION', 'REFUND', 'PACK_PURCHASE', 'PERK_BONUS', 'REFERRAL_BONUS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- TABLES
-- =============================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    coins DECIMAL(12,2) DEFAULT 0 CHECK (coins >= 0),
    rank user_rank DEFAULT 'INITIATE',
    total_contributed DECIMAL(12,2) DEFAULT 0 CHECK (total_contributed >= 0),
    total_spent DECIMAL(12,2) DEFAULT 0 CHECK (total_spent >= 0),
    nft_count INT DEFAULT 0 CHECK (nft_count >= 0),
    packs_opened INT DEFAULT 0 CHECK (packs_opened >= 0),
    vip_access BOOLEAN DEFAULT FALSE,
    wallet_address TEXT,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES users(id),
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOXES TABLE (Crowdfunded products)
CREATE TABLE IF NOT EXISTS boxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    product_type TEXT DEFAULT 'booster_box', -- booster_box, etb, premium, etc.
    target_price DECIMAL(10,2) NOT NULL CHECK (target_price > 0),
    current_raised DECIMAL(10,2) DEFAULT 0 CHECK (current_raised >= 0),
    status box_status DEFAULT 'FUNDING',
    contributors_count INT DEFAULT 0 CHECK (contributors_count >= 0),
    min_contribution DECIMAL(10,2) DEFAULT 1,
    max_contribution DECIMAL(10,2),
    scheduled_break TIMESTAMPTZ,
    stream_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_secret BOOLEAN DEFAULT FALSE, -- For vault access holders only
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- CONTRIBUTIONS TABLE
CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    multiplier DECIMAL(3,2) DEFAULT 1.00, -- From NFT perks
    effective_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount * multiplier) STORED,
    is_anonymous BOOLEAN DEFAULT FALSE, -- From Shadow Contributor perk
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, box_id, created_at) -- Allow multiple contributions
);

-- NFT COLLECTION TABLE
CREATE TABLE IF NOT EXISTS nft_collection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id INT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    rarity nft_rarity NOT NULL,
    perk_id TEXT NOT NULL,
    perk_name TEXT NOT NULL,
    perk_description TEXT NOT NULL,
    perk_value JSONB NOT NULL,
    total_supply INT DEFAULT 1,
    minted_count INT DEFAULT 0,
    is_genesis BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER NFTs (Owned NFTs)
CREATE TABLE IF NOT EXISTS user_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nft_id UUID NOT NULL REFERENCES nft_collection(id),
    token_instance INT NOT NULL, -- Instance number of this NFT
    mint_transaction_hash TEXT,
    acquired_from TEXT DEFAULT 'pack', -- pack, transfer, claim
    acquired_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(nft_id, token_instance)
);

-- PACK OPENINGS TABLE
CREATE TABLE IF NOT EXISTS pack_openings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pack_tier INT NOT NULL CHECK (pack_tier IN (1, 2, 5, 10, 20, 50, 100)),
    cost DECIMAL(10,2) NOT NULL,
    nfts_received UUID[] NOT NULL, -- Array of user_nft IDs
    opened_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    coins_amount DECIMAL(12,2), -- Coins credited/debited
    reference_id UUID, -- box_id, pack_opening_id, etc.
    reference_type TEXT, -- 'box', 'pack', 'referral'
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    status transaction_status DEFAULT 'PENDING',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- BOX HITS TABLE (Cards pulled from physical boxes)
CREATE TABLE IF NOT EXISTS box_hits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
    card_name TEXT NOT NULL,
    card_set TEXT,
    card_number TEXT,
    estimated_value DECIMAL(10,2),
    image_url TEXT,
    is_chase BOOLEAN DEFAULT FALSE, -- Big hit
    winner_user_id UUID REFERENCES users(id), -- Who won this card
    claimed BOOLEAN DEFAULT FALSE,
    shipped BOOLEAN DEFAULT FALSE,
    tracking_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RAFFLES TABLE (For hit distribution)
CREATE TABLE IF NOT EXISTS raffles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
    hit_id UUID NOT NULL REFERENCES box_hits(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, completed
    winner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- RAFFLE ENTRIES
CREATE TABLE IF NOT EXISTS raffle_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raffle_id UUID NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tickets INT NOT NULL DEFAULT 1, -- Based on contribution + perks
    boost_percentage INT DEFAULT 0, -- From Loaded Dice perk
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(raffle_id, user_id)
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, contribution, win
    reference_id UUID,
    reference_type TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY FEED (Public events)
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username TEXT, -- Cached for display
    event_type TEXT NOT NULL, -- contribution, pack_open, big_hit, box_complete
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_rank ON users(rank);

CREATE INDEX IF NOT EXISTS idx_boxes_status ON boxes(status);
CREATE INDEX IF NOT EXISTS idx_boxes_featured ON boxes(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_boxes_secret ON boxes(is_secret) WHERE is_secret = TRUE;

CREATE INDEX IF NOT EXISTS idx_contributions_user ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_box ON contributions(box_id);
CREATE INDEX IF NOT EXISTS idx_contributions_created ON contributions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_nfts_user ON user_nfts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_nfts_nft ON user_nfts(nft_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Apply to boxes
DROP TRIGGER IF EXISTS trigger_boxes_updated_at ON boxes;
CREATE TRIGGER trigger_boxes_updated_at
    BEFORE UPDATE ON boxes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Update box stats on contribution
CREATE OR REPLACE FUNCTION update_box_on_contribution()
RETURNS TRIGGER AS $$
BEGIN
    -- Update box totals
    UPDATE boxes
    SET
        current_raised = current_raised + NEW.effective_amount,
        contributors_count = (
            SELECT COUNT(DISTINCT user_id)
            FROM contributions
            WHERE box_id = NEW.box_id
        )
    WHERE id = NEW.box_id;

    -- Check if box is fully funded
    UPDATE boxes
    SET status = 'READY'
    WHERE id = NEW.box_id
        AND current_raised >= target_price
        AND status = 'FUNDING';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_box_on_contribution ON contributions;
CREATE TRIGGER trigger_update_box_on_contribution
    AFTER INSERT ON contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_box_on_contribution();

-- Update user stats on contribution
CREATE OR REPLACE FUNCTION update_user_on_contribution()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET
        coins = coins - NEW.amount,
        total_contributed = total_contributed + NEW.amount,
        vip_access = CASE
            WHEN total_contributed + NEW.amount >= 2 THEN TRUE
            ELSE vip_access
        END,
        rank = CASE
            WHEN total_contributed + NEW.amount >= 1000 THEN 'PROTOCOL'::user_rank
            WHEN total_contributed + NEW.amount >= 250 THEN 'SYNDICATE'::user_rank
            WHEN total_contributed + NEW.amount >= 50 THEN 'BREAKER'::user_rank
            ELSE rank
        END
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_on_contribution ON contributions;
CREATE TRIGGER trigger_update_user_on_contribution
    AFTER INSERT ON contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_on_contribution();

-- Update user NFT count
CREATE OR REPLACE FUNCTION update_user_nft_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET nft_count = nft_count + 1 WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET nft_count = nft_count - 1 WHERE id = OLD.user_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_nft_count ON user_nfts;
CREATE TRIGGER trigger_update_user_nft_count
    AFTER INSERT OR DELETE ON user_nfts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_nft_count();

-- Update user packs opened count
CREATE OR REPLACE FUNCTION update_user_packs_opened()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET
        packs_opened = packs_opened + 1,
        total_spent = total_spent + NEW.cost
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_packs_opened ON pack_openings;
CREATE TRIGGER trigger_update_user_packs_opened
    AFTER INSERT ON pack_openings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_packs_opened();

-- Generate referral code for new users
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code = UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_referral_code ON users;
CREATE TRIGGER trigger_generate_referral_code
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE box_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (auth.uid() = id);

-- Boxes policies
CREATE POLICY "Public boxes viewable by everyone" ON boxes FOR SELECT USING (is_secret = FALSE OR is_secret IS NULL);
CREATE POLICY "Secret boxes for vault holders" ON boxes FOR SELECT USING (
    is_secret = TRUE AND EXISTS (
        SELECT 1 FROM user_nfts un
        JOIN nft_collection nc ON un.nft_id = nc.id
        WHERE un.user_id = auth.uid()
        AND nc.perk_id = 'GENESIS_VAULT'
    )
);

-- Contributions policies
CREATE POLICY "Contributions viewable by everyone" ON contributions FOR SELECT USING (true);
CREATE POLICY "Users can create own contributions" ON contributions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NFT Collection policies
CREATE POLICY "NFT collection viewable by everyone" ON nft_collection FOR SELECT USING (true);

-- User NFTs policies
CREATE POLICY "User NFTs viewable by everyone" ON user_nfts FOR SELECT USING (true);

-- Pack openings policies
CREATE POLICY "Users can view own pack openings" ON pack_openings FOR SELECT USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Box hits policies
CREATE POLICY "Box hits viewable by everyone" ON box_hits FOR SELECT USING (true);

-- Raffles policies
CREATE POLICY "Raffles viewable by everyone" ON raffles FOR SELECT USING (true);

-- Raffle entries policies
CREATE POLICY "Raffle entries viewable by participants" ON raffle_entries FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Activity feed policies
CREATE POLICY "Activity feed viewable by everyone" ON activity_feed FOR SELECT USING (true);

-- =============================================
-- REALTIME SUBSCRIPTIONS
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE boxes;
ALTER PUBLICATION supabase_realtime ADD TABLE contributions;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =============================================
-- SEED DATA: GENESIS NFT COLLECTION
-- =============================================

INSERT INTO nft_collection (token_id, name, description, image_url, rarity, perk_id, perk_name, perk_description, perk_value, total_supply) VALUES
-- COMMON (45 cards)
(1, 'Ember Spark', 'A flickering flame of potential', '/nfts/common/1.png', 'COMMON', 'COIN_SURGE', 'Coin Surge', '+5% coins extra on every purchase', '{"bonus_percentage": 5}', 5),
(2, 'Shadow Veil', 'Cloak yourself in mystery', '/nfts/common/2.png', 'COMMON', 'SHADOW_CONTRIBUTOR', 'Shadow Contributor', 'Your name appears hidden in public contributions', '{"anonymous_mode": true}', 5),
(3, 'Red Mist', 'The domain begins to form', '/nfts/common/3.png', 'COMMON', 'COIN_SURGE', 'Coin Surge', '+5% coins extra on every purchase', '{"bonus_percentage": 5}', 5),
(4, 'Blood Moon', 'Power rises with the night', '/nfts/common/4.png', 'COMMON', 'SHADOW_CONTRIBUTOR', 'Shadow Contributor', 'Your name appears hidden in public contributions', '{"anonymous_mode": true}', 5),
(5, 'Crimson Echo', 'Whispers of the domain', '/nfts/common/5.png', 'COMMON', 'COIN_SURGE', 'Coin Surge', '+5% coins extra on every purchase', '{"bonus_percentage": 5}', 5),

-- RARE (30 cards)
(46, 'Domain Fragment', 'A piece of something greater', '/nfts/rare/1.png', 'RARE', 'EARLY_ACCESS', 'Early Access Protocol', '24h early access to new boxes', '{"early_hours": 24}', 4),
(47, 'Amplifier Core', 'Magnify your influence', '/nfts/rare/2.png', 'RARE', 'MULTIPLIER_X1_2', 'Amplifier Node', 'x1.2 multiplier on progress bars', '{"bar_multiplier": 1.2}', 4),
(48, 'Void Shard', 'Touch the emptiness', '/nfts/rare/3.png', 'RARE', 'EARLY_ACCESS', 'Early Access Protocol', '24h early access to new boxes', '{"early_hours": 24}', 4),
(49, 'Power Conduit', 'Channel the energy', '/nfts/rare/4.png', 'RARE', 'MULTIPLIER_X1_2', 'Amplifier Node', 'x1.2 multiplier on progress bars', '{"bar_multiplier": 1.2}', 4),
(50, 'Scarlet Thread', 'Connected to fate', '/nfts/rare/5.png', 'RARE', 'EARLY_ACCESS', 'Early Access Protocol', '24h early access to new boxes', '{"early_hours": 24}', 4),

-- EPIC (15 cards)
(76, 'Phantom Gate', 'Passage to the other side', '/nfts/epic/1.png', 'EPIC', 'FREE_SHIPPING', 'Phantom Delivery', 'Free shipping on physical hits (1/month)', '{"free_ships_monthly": 1}', 3),
(77, 'Fortune''s Edge', 'Luck favors the bold', '/nfts/epic/2.png', 'EPIC', 'RAFFLE_BOOST', 'Loaded Dice', '+50% probability in exclusive raffles', '{"raffle_boost": 50}', 3),
(78, 'Crimson Blade', 'Cut through the competition', '/nfts/epic/3.png', 'EPIC', 'FREE_SHIPPING', 'Phantom Delivery', 'Free shipping on physical hits (1/month)', '{"free_ships_monthly": 1}', 3),
(79, 'Lucky Star', 'Fortune smiles upon you', '/nfts/epic/4.png', 'EPIC', 'RAFFLE_BOOST', 'Loaded Dice', '+50% probability in exclusive raffles', '{"raffle_boost": 50}', 3),
(80, 'Void Walker', 'Between dimensions', '/nfts/epic/5.png', 'EPIC', 'FREE_SHIPPING', 'Phantom Delivery', 'Free shipping on physical hits (1/month)', '{"free_ships_monthly": 1}', 3),

-- LEGENDARY (8 cards)
(91, 'Genesis Key', 'Unlock the vault', '/nfts/legendary/1.png', 'LEGENDARY', 'GENESIS_VAULT', 'Genesis Vault Key', 'Access to secret box drops (holders only)', '{"vault_access": true}', 2),
(92, 'Protocol Shield', 'Protection from loss', '/nfts/legendary/2.png', 'LEGENDARY', 'REFUND_SHIELD', 'Protocol Shield', 'Recover 25% of contributions on boxes without hits', '{"refund_percentage": 25}', 2),
(93, 'Vault Guardian', 'Keeper of secrets', '/nfts/legendary/3.png', 'LEGENDARY', 'GENESIS_VAULT', 'Genesis Vault Key', 'Access to secret box drops (holders only)', '{"vault_access": true}', 2),
(94, 'Iron Will', 'Unbreakable resolve', '/nfts/legendary/4.png', 'LEGENDARY', 'REFUND_SHIELD', 'Protocol Shield', 'Recover 25% of contributions on boxes without hits', '{"refund_percentage": 25}', 2),

-- MYTHIC (2 cards)
(99, 'Domain Expansion: Alpha', 'Rule the domain', '/nfts/mythic/1.png', 'MYTHIC', 'ALPHA_SEAT', 'Alpha Seat', 'Vote on which boxes open + 10% profit share on hits', '{"governance": true, "profit_share": 10}', 1),
(100, 'Infinite Ryōiki', 'Limitless power', '/nfts/mythic/2.png', 'MYTHIC', 'INFINITE_PROTOCOL', 'Infinite Protocol', '1 free pack weekly + all EPIC perks active', '{"weekly_pack": true, "inherit_epic": true}', 1)

ON CONFLICT (token_id) DO NOTHING;

-- =============================================
-- SEED DATA: SAMPLE BOXES
-- =============================================

INSERT INTO boxes (name, description, image_url, product_type, target_price, is_featured) VALUES
('Prismatic Evolutions', 'Booster Box — 36 Packs', '/boxes/prismatic.jpg', 'booster_box', 400.00, true),
('Surging Sparks', 'Elite Trainer Box', '/boxes/surging.jpg', 'etb', 85.00, false),
('Crown Zenith', 'Premium Collection', '/boxes/crown.jpg', 'premium', 150.00, false)
ON CONFLICT DO NOTHING;

-- =============================================
-- DONE!
-- =============================================

SELECT 'Database setup complete!' as status;
