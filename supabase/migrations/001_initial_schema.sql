-- BREAK PROTOCOL - Initial Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE user_rank AS ENUM ('INITIATE', 'BREAKER', 'SYNDICATE', 'PROTOCOL');
CREATE TYPE box_status AS ENUM ('FUNDING', 'READY', 'BREAKING', 'COMPLETED');
CREATE TYPE nft_rarity AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC');
CREATE TYPE transaction_type AS ENUM ('PURCHASE', 'CONTRIBUTION', 'REFUND', 'PERK_BONUS');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  coins DECIMAL(12,2) DEFAULT 0 CHECK (coins >= 0),
  rank user_rank DEFAULT 'INITIATE',
  total_contributed DECIMAL(12,2) DEFAULT 0 CHECK (total_contributed >= 0),
  nft_count INT DEFAULT 0 CHECK (nft_count >= 0),
  vip_access BOOLEAN DEFAULT FALSE,
  wallet_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boxes table
CREATE TABLE boxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  target_price DECIMAL(10,2) NOT NULL CHECK (target_price > 0),
  current_raised DECIMAL(10,2) DEFAULT 0 CHECK (current_raised >= 0),
  status box_status DEFAULT 'FUNDING',
  contributors_count INT DEFAULT 0 CHECK (contributors_count >= 0),
  scheduled_break TIMESTAMPTZ,
  stream_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contributions table
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  box_id UUID REFERENCES boxes(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  multiplier DECIMAL(3,2) DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NFTs table
CREATE TABLE nfts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id INT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rarity nft_rarity NOT NULL,
  perk_type TEXT NOT NULL,
  perk_value JSONB NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  minted_at TIMESTAMPTZ,
  is_genesis BOOLEAN DEFAULT TRUE
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reference_id UUID,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pack openings table
CREATE TABLE pack_openings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pack_tier INT NOT NULL CHECK (pack_tier IN (1, 2, 5, 10, 20, 50, 100)),
  nfts_received UUID[] NOT NULL,
  opened_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_contributions_box ON contributions(box_id);
CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_nfts_owner ON nfts(owner_id);
CREATE INDEX idx_nfts_rarity ON nfts(rarity);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_boxes_status ON boxes(status);

-- Trigger to update box stats on contribution
CREATE OR REPLACE FUNCTION update_box_on_contribution()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE boxes
  SET
    current_raised = current_raised + NEW.amount * NEW.multiplier,
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

CREATE TRIGGER trigger_update_box_on_contribution
AFTER INSERT ON contributions
FOR EACH ROW
EXECUTE FUNCTION update_box_on_contribution();

-- Trigger to update user stats on contribution
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
      WHEN total_contributed + NEW.amount >= 1000 THEN 'PROTOCOL'
      WHEN total_contributed + NEW.amount >= 250 THEN 'SYNDICATE'
      WHEN total_contributed + NEW.amount >= 50 THEN 'BREAKER'
      ELSE rank
    END
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_on_contribution
AFTER INSERT ON contributions
FOR EACH ROW
EXECUTE FUNCTION update_user_on_contribution();

-- Trigger to update user NFT count
CREATE OR REPLACE FUNCTION update_user_nft_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    -- Decrement old owner
    IF OLD.owner_id IS NOT NULL THEN
      UPDATE users SET nft_count = nft_count - 1 WHERE id = OLD.owner_id;
    END IF;
    -- Increment new owner
    IF NEW.owner_id IS NOT NULL THEN
      UPDATE users SET nft_count = nft_count + 1 WHERE id = NEW.owner_id;
    END IF;
  ELSIF TG_OP = 'INSERT' AND NEW.owner_id IS NOT NULL THEN
    UPDATE users SET nft_count = nft_count + 1 WHERE id = NEW.owner_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_nft_count
AFTER INSERT OR UPDATE ON nfts
FOR EACH ROW
EXECUTE FUNCTION update_user_nft_count();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_openings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read all users but only update their own
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Boxes are public read
CREATE POLICY "Boxes are viewable by everyone" ON boxes FOR SELECT USING (true);

-- Contributions are public read
CREATE POLICY "Contributions are viewable by everyone" ON contributions FOR SELECT USING (true);
CREATE POLICY "Users can create own contributions" ON contributions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- NFTs are public read
CREATE POLICY "NFTs are viewable by everyone" ON nfts FOR SELECT USING (true);

-- Transactions visible to owner only
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid()::text = user_id::text);

-- Pack openings visible to owner only
CREATE POLICY "Users can view own pack openings" ON pack_openings FOR SELECT USING (auth.uid()::text = user_id::text);

-- Enable realtime for boxes and contributions
ALTER PUBLICATION supabase_realtime ADD TABLE boxes;
ALTER PUBLICATION supabase_realtime ADD TABLE contributions;
