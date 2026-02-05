-- =============================================
-- RYŌIKI - COMPLETE DATABASE SCHEMA
-- Sistema de sobres con pokeballs y crowdfunding
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
    CREATE TYPE pack_status AS ENUM ('PENDING', 'OPENED', 'SHIPPED', 'DELIVERED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('CONTRIBUTION', 'PACK_PURCHASE', 'REFUND', 'BONUS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- DROP EXISTING TABLES (for clean install)
-- =============================================

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

-- =============================================
-- TABLES
-- =============================================

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    phone TEXT,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,

    -- Pokeball balance (coins)
    pokeballs INT DEFAULT 0 CHECK (pokeballs >= 0),

    -- Stats
    total_contributed DECIMAL(12,2) DEFAULT 0 CHECK (total_contributed >= 0),
    total_packs_bought INT DEFAULT 0 CHECK (total_packs_bought >= 0),
    rank user_rank DEFAULT 'INITIATE',

    -- Contact preference
    contact_type TEXT DEFAULT 'email' CHECK (contact_type IN ('email', 'phone')),

    -- Stripe
    stripe_customer_id TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOXES TABLE (Crowdfunding boxes for channel content)
CREATE TABLE boxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,

    -- Pricing
    target_price DECIMAL(10,2) NOT NULL CHECK (target_price > 0),
    current_raised DECIMAL(10,2) DEFAULT 0 CHECK (current_raised >= 0),

    -- Status
    status box_status DEFAULT 'FUNDING',
    contributors_count INT DEFAULT 0 CHECK (contributors_count >= 0),

    -- Scheduling
    scheduled_break TIMESTAMPTZ,
    stream_url TEXT,

    -- Flags
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- PACKS TABLE (Available packs to buy with pokeballs)
CREATE TABLE packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_es TEXT,
    description TEXT,
    image_url TEXT NOT NULL,

    -- Pricing in pokeballs
    price_pokeballs INT NOT NULL CHECK (price_pokeballs > 0),

    -- Info
    set_name TEXT,
    cards_per_pack INT DEFAULT 10,

    -- Flags
    is_featured BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTRIBUTIONS TABLE (User contributions to crowdfunding boxes)
-- System: 8€ = 6 pokeballs to user + 2€ to box
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,

    -- Amounts
    euros_paid DECIMAL(10,2) NOT NULL CHECK (euros_paid > 0),
    euros_to_box DECIMAL(10,2) NOT NULL CHECK (euros_to_box > 0),
    pokeballs_given INT NOT NULL CHECK (pokeballs_given >= 0),

    -- Payment
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    status transaction_status DEFAULT 'PENDING',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- PACK PURCHASES TABLE (When user buys a pack with pokeballs)
CREATE TABLE pack_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pack_id UUID NOT NULL REFERENCES packs(id),

    -- Cost
    pokeballs_spent INT NOT NULL CHECK (pokeballs_spent > 0),

    -- Status
    status pack_status DEFAULT 'PENDING',

    -- Opening info
    stream_date TIMESTAMPTZ,
    stream_url TEXT,

    -- Shipping (if cards need to be sent)
    shipping_address TEXT,
    tracking_number TEXT,

    -- Timestamps
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- PACK CARDS TABLE (Cards that came out of a pack)
CREATE TABLE pack_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pack_purchase_id UUID NOT NULL REFERENCES pack_purchases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Card info
    card_name TEXT NOT NULL,
    card_set TEXT,
    card_number TEXT,
    card_rarity TEXT,
    image_url TEXT,

    -- Value
    estimated_value DECIMAL(10,2),

    -- Flags
    is_holo BOOLEAN DEFAULT FALSE,
    is_chase BOOLEAN DEFAULT FALSE, -- Big hit

    -- Sale status
    is_for_sale BOOLEAN DEFAULT FALSE,
    sale_price DECIMAL(10,2),
    is_sold BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARD SALES TABLE (When a card is sold)
-- Commission: 1% + shipping
CREATE TABLE card_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL REFERENCES pack_cards(id),
    seller_id UUID NOT NULL REFERENCES users(id),

    -- Pricing
    sale_price DECIMAL(10,2) NOT NULL,
    commission_percent DECIMAL(5,2) DEFAULT 1.00,
    commission_amount DECIMAL(10,2),
    shipping_cost DECIMAL(10,2),
    seller_receives DECIMAL(10,2),

    -- Buyer info (can be external)
    buyer_name TEXT,
    buyer_email TEXT,
    buyer_address TEXT,

    -- Payment
    stripe_payment_id TEXT,

    -- Shipping
    tracking_number TEXT,

    -- Status
    status TEXT DEFAULT 'pending', -- pending, paid, shipped, delivered

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- TRANSACTIONS TABLE (All money movements)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Type
    type transaction_type NOT NULL,

    -- Amounts
    euros_amount DECIMAL(10,2),
    pokeballs_amount INT,

    -- Reference
    reference_id UUID, -- contribution_id, pack_purchase_id, etc.
    reference_type TEXT, -- 'contribution', 'pack_purchase', etc.

    -- Payment
    stripe_payment_intent_id TEXT,
    status transaction_status DEFAULT 'PENDING',

    -- Description
    description TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, stream, pack_opened

    -- Reference
    reference_id UUID,
    reference_type TEXT,

    -- Status
    is_read BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY FEED TABLE (Public events)
CREATE TABLE activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username TEXT,

    event_type TEXT NOT NULL, -- contribution, pack_purchase, big_hit, box_complete
    message TEXT NOT NULL,

    -- Extra data
    metadata JSONB,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_username ON users(username);

CREATE INDEX idx_boxes_status ON boxes(status);
CREATE INDEX idx_boxes_featured ON boxes(is_featured) WHERE is_featured = TRUE;

CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_contributions_box ON contributions(box_id);
CREATE INDEX idx_contributions_status ON contributions(status);

CREATE INDEX idx_pack_purchases_user ON pack_purchases(user_id);
CREATE INDEX idx_pack_purchases_status ON pack_purchases(status);

CREATE INDEX idx_pack_cards_user ON pack_cards(user_id);
CREATE INDEX idx_pack_cards_for_sale ON pack_cards(is_for_sale) WHERE is_for_sale = TRUE;

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);

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

-- Apply updated_at trigger to users
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Apply updated_at trigger to boxes
DROP TRIGGER IF EXISTS trigger_boxes_updated_at ON boxes;
CREATE TRIGGER trigger_boxes_updated_at
    BEFORE UPDATE ON boxes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function: When contribution is completed, update box and user
CREATE OR REPLACE FUNCTION process_contribution()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process when status changes to COMPLETED
    IF NEW.status = 'COMPLETED' AND (OLD.status IS NULL OR OLD.status != 'COMPLETED') THEN

        -- Update box totals
        UPDATE boxes
        SET
            current_raised = current_raised + NEW.euros_to_box,
            contributors_count = (
                SELECT COUNT(DISTINCT user_id)
                FROM contributions
                WHERE box_id = NEW.box_id AND status = 'COMPLETED'
            )
        WHERE id = NEW.box_id;

        -- Check if box is fully funded
        UPDATE boxes
        SET status = 'READY', completed_at = NOW()
        WHERE id = NEW.box_id
            AND current_raised >= target_price
            AND status = 'FUNDING';

        -- Give pokeballs to user
        UPDATE users
        SET
            pokeballs = pokeballs + NEW.pokeballs_given,
            total_contributed = total_contributed + NEW.euros_paid,
            rank = CASE
                WHEN total_contributed + NEW.euros_paid >= 500 THEN 'PROTOCOL'::user_rank
                WHEN total_contributed + NEW.euros_paid >= 200 THEN 'SYNDICATE'::user_rank
                WHEN total_contributed + NEW.euros_paid >= 50 THEN 'BREAKER'::user_rank
                ELSE rank
            END
        WHERE id = NEW.user_id;

        -- Mark contribution as completed
        NEW.completed_at = NOW();

        -- Create activity feed entry
        INSERT INTO activity_feed (user_id, username, event_type, message, metadata)
        SELECT
            NEW.user_id,
            u.username,
            'contribution',
            u.username || ' aportó ' || NEW.euros_paid || '€',
            jsonb_build_object(
                'euros_paid', NEW.euros_paid,
                'pokeballs_given', NEW.pokeballs_given,
                'box_id', NEW.box_id
            )
        FROM users u WHERE u.id = NEW.user_id;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_process_contribution ON contributions;
CREATE TRIGGER trigger_process_contribution
    BEFORE UPDATE ON contributions
    FOR EACH ROW
    EXECUTE FUNCTION process_contribution();

-- Function: When pack is purchased, deduct pokeballs
CREATE OR REPLACE FUNCTION process_pack_purchase()
RETURNS TRIGGER AS $$
BEGIN
    -- Deduct pokeballs from user
    UPDATE users
    SET
        pokeballs = pokeballs - NEW.pokeballs_spent,
        total_packs_bought = total_packs_bought + 1
    WHERE id = NEW.user_id;

    -- Check user has enough pokeballs
    IF (SELECT pokeballs FROM users WHERE id = NEW.user_id) < 0 THEN
        RAISE EXCEPTION 'Not enough pokeballs';
    END IF;

    -- Create activity feed entry
    INSERT INTO activity_feed (user_id, username, event_type, message, metadata)
    SELECT
        NEW.user_id,
        u.username,
        'pack_purchase',
        u.username || ' compró un sobre',
        jsonb_build_object(
            'pack_id', NEW.pack_id,
            'pokeballs_spent', NEW.pokeballs_spent
        )
    FROM users u WHERE u.id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_process_pack_purchase ON pack_purchases;
CREATE TRIGGER trigger_process_pack_purchase
    AFTER INSERT ON pack_purchases
    FOR EACH ROW
    EXECUTE FUNCTION process_pack_purchase();

-- Function: Calculate card sale amounts
CREATE OR REPLACE FUNCTION calculate_card_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate commission (1%)
    NEW.commission_amount = NEW.sale_price * (NEW.commission_percent / 100);

    -- Calculate what seller receives
    NEW.seller_receives = NEW.sale_price - NEW.commission_amount - COALESCE(NEW.shipping_cost, 0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_card_sale ON card_sales;
CREATE TRIGGER trigger_calculate_card_sale
    BEFORE INSERT OR UPDATE ON card_sales
    FOR EACH ROW
    EXECUTE FUNCTION calculate_card_sale();

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

-- Users policies
CREATE POLICY "Users viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);

-- Boxes policies
CREATE POLICY "Boxes viewable by everyone" ON boxes FOR SELECT USING (true);

-- Packs policies
CREATE POLICY "Packs viewable by everyone" ON packs FOR SELECT USING (true);

-- Contributions policies
CREATE POLICY "Contributions viewable by everyone" ON contributions FOR SELECT USING (true);
CREATE POLICY "Users can create own contributions" ON contributions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pack purchases policies
CREATE POLICY "Users can view own purchases" ON pack_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own purchases" ON pack_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pack cards policies
CREATE POLICY "Pack cards viewable by everyone" ON pack_cards FOR SELECT USING (true);
CREATE POLICY "Users can update own cards" ON pack_cards FOR UPDATE USING (auth.uid() = user_id);

-- Card sales policies
CREATE POLICY "Card sales viewable by everyone" ON card_sales FOR SELECT USING (true);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Activity feed policies
CREATE POLICY "Activity feed viewable by everyone" ON activity_feed FOR SELECT USING (true);

-- =============================================
-- REALTIME SUBSCRIPTIONS
-- =============================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE boxes;
ALTER PUBLICATION supabase_realtime ADD TABLE contributions;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =============================================
-- SEED DATA: PACKS
-- =============================================

INSERT INTO packs (name, name_es, description, image_url, price_pokeballs, set_name, is_featured, is_available) VALUES
('Prismatic Evolutions', 'Evoluciones Prismáticas', 'Espeon & Umbreon artwork', '/packs/prismatic-evolutions.png', 9, 'Scarlet & Violet', true, true),
('Rising Heroes', 'Héroes Ascendentes', 'Premium expansion pack', '/packs/heroes-ascendentes.png', 12, 'Scarlet & Violet', true, true),
('Phantom Flames', 'Fuegos Fantasmales', 'Mega Charizard X artwork', '/packs/phantom-flames.png', 7, 'XY Series', false, true),
('Obsidian Flames', 'Fulgor Negro', 'Dark power unleashed', '/packs/black-flame.png', 7, 'Scarlet & Violet', false, true),
('White Flame', 'Llama Blanca', 'Pure fire energy', '/packs/white-flame.png', 7, 'XY Series', false, true),
('Mega Evolution', 'Megaevolución', 'Mega Gardevoir artwork', '/packs/mega-gardevoir.png', 7, 'XY Series', false, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: SAMPLE BOXES
-- =============================================

INSERT INTO boxes (name, description, image_url, target_price, is_featured, is_trending) VALUES
('Prismatic Evolutions', 'Booster Box — 36 Packs', '/packs/prismatic-evolutions.png', 400.00, true, true),
('Rising Heroes', 'Elite Trainer Box', '/packs/heroes-ascendentes.png', 120.00, false, false),
('Obsidian Flames', 'Booster Box — 36 Packs', '/packs/black-flame.png', 180.00, false, false)
ON CONFLICT DO NOTHING;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to create a contribution (call from backend/API)
-- Usage: SELECT create_contribution('user-uuid', 'box-uuid', 8.00);
CREATE OR REPLACE FUNCTION create_contribution(
    p_user_id UUID,
    p_box_id UUID,
    p_euros_paid DECIMAL
)
RETURNS contributions AS $$
DECLARE
    v_contribution contributions;
    v_pokeballs INT;
    v_euros_to_box DECIMAL;
BEGIN
    -- Calculate: for every 8€, user gets 6 pokeballs and 2€ goes to box
    v_pokeballs := FLOOR(p_euros_paid / 8) * 6;
    v_euros_to_box := FLOOR(p_euros_paid / 8) * 2;

    INSERT INTO contributions (user_id, box_id, euros_paid, euros_to_box, pokeballs_given, status)
    VALUES (p_user_id, p_box_id, p_euros_paid, v_euros_to_box, v_pokeballs, 'PENDING')
    RETURNING * INTO v_contribution;

    RETURN v_contribution;
END;
$$ LANGUAGE plpgsql;

-- Function to complete a contribution (call after Stripe payment succeeds)
CREATE OR REPLACE FUNCTION complete_contribution(
    p_contribution_id UUID,
    p_stripe_payment_intent_id TEXT
)
RETURNS contributions AS $$
DECLARE
    v_contribution contributions;
BEGIN
    UPDATE contributions
    SET
        status = 'COMPLETED',
        stripe_payment_intent_id = p_stripe_payment_intent_id
    WHERE id = p_contribution_id
    RETURNING * INTO v_contribution;

    RETURN v_contribution;
END;
$$ LANGUAGE plpgsql;

-- Function to purchase a pack
CREATE OR REPLACE FUNCTION purchase_pack(
    p_user_id UUID,
    p_pack_id UUID
)
RETURNS pack_purchases AS $$
DECLARE
    v_pack packs;
    v_user users;
    v_purchase pack_purchases;
    v_next_friday TIMESTAMPTZ;
BEGIN
    -- Get pack info
    SELECT * INTO v_pack FROM packs WHERE id = p_pack_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pack not found';
    END IF;

    -- Get user info
    SELECT * INTO v_user FROM users WHERE id = p_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Check user has enough pokeballs
    IF v_user.pokeballs < v_pack.price_pokeballs THEN
        RAISE EXCEPTION 'Not enough pokeballs. Need %, have %', v_pack.price_pokeballs, v_user.pokeballs;
    END IF;

    -- Calculate next Friday at 20:00
    v_next_friday := date_trunc('week', NOW()) + INTERVAL '4 days 20 hours';
    IF v_next_friday < NOW() THEN
        v_next_friday := v_next_friday + INTERVAL '7 days';
    END IF;

    -- Create purchase
    INSERT INTO pack_purchases (user_id, pack_id, pokeballs_spent, stream_date)
    VALUES (p_user_id, p_pack_id, v_pack.price_pokeballs, v_next_friday)
    RETURNING * INTO v_purchase;

    RETURN v_purchase;
END;
$$ LANGUAGE plpgsql;

-- Function to list a card for sale
CREATE OR REPLACE FUNCTION list_card_for_sale(
    p_card_id UUID,
    p_price DECIMAL
)
RETURNS pack_cards AS $$
DECLARE
    v_card pack_cards;
BEGIN
    UPDATE pack_cards
    SET
        is_for_sale = true,
        sale_price = p_price
    WHERE id = p_card_id
    RETURNING * INTO v_card;

    RETURN v_card;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VIEWS
-- =============================================

-- View: User dashboard
CREATE OR REPLACE VIEW user_dashboard AS
SELECT
    u.id,
    u.username,
    u.pokeballs,
    u.total_contributed,
    u.total_packs_bought,
    u.rank,
    (SELECT COUNT(*) FROM pack_purchases pp WHERE pp.user_id = u.id AND pp.status = 'PENDING') as pending_packs,
    (SELECT COUNT(*) FROM pack_cards pc WHERE pc.user_id = u.id) as total_cards,
    (SELECT COUNT(*) FROM pack_cards pc WHERE pc.user_id = u.id AND pc.is_for_sale = true) as cards_for_sale
FROM users u;

-- View: Active boxes with progress
CREATE OR REPLACE VIEW active_boxes AS
SELECT
    b.*,
    ROUND((b.current_raised / b.target_price) * 100, 2) as progress_percent,
    b.target_price - b.current_raised as remaining
FROM boxes b
WHERE b.status = 'FUNDING'
ORDER BY b.is_trending DESC, b.is_featured DESC, b.created_at DESC;

-- View: Marketplace (cards for sale)
CREATE OR REPLACE VIEW marketplace AS
SELECT
    pc.*,
    u.username as seller_username,
    p.name as pack_name
FROM pack_cards pc
JOIN users u ON pc.user_id = u.id
JOIN pack_purchases pp ON pc.pack_purchase_id = pp.id
JOIN packs p ON pp.pack_id = p.id
WHERE pc.is_for_sale = true AND pc.is_sold = false
ORDER BY pc.created_at DESC;

-- =============================================
-- DONE!
-- =============================================

SELECT 'Ryōiki database setup complete!' as status;
