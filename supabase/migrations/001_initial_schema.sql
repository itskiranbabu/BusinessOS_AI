-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CLIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Lead', 'Active', 'Churned')),
  program TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  last_check_in TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for clients
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);

-- =====================================================
-- SOCIAL POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL,
  hook TEXT NOT NULL,
  body TEXT NOT NULL,
  cta TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Video', 'Image', 'Carousel', 'Text')),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Scheduled', 'Published')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for social_posts
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts" ON social_posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts" ON social_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON social_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON social_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for social_posts
CREATE INDEX idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_posts_scheduled_at ON social_posts(scheduled_at);

-- =====================================================
-- AUTOMATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Email', 'WhatsApp', 'SMS')),
  trigger TEXT NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Paused')),
  sent_count INTEGER DEFAULT 0,
  opened_rate TEXT DEFAULT '0%',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for automations
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automations" ON automations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own automations" ON automations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own automations" ON automations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own automations" ON automations
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for automations
CREATE INDEX idx_automations_user_id ON automations(user_id);
CREATE INDEX idx_automations_status ON automations(status);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- =====================================================
-- BUSINESS BLUEPRINTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS business_blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  niche TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  mission TEXT NOT NULL,
  website_data JSONB NOT NULL DEFAULT '{}',
  suggested_programs TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for business_blueprints
ALTER TABLE business_blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blueprint" ON business_blueprints
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blueprint" ON business_blueprints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blueprint" ON business_blueprints
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blueprint" ON business_blueprints
  FOR DELETE USING (auth.uid() = user_id);

-- Index for business_blueprints
CREATE INDEX idx_business_blueprints_user_id ON business_blueprints(user_id);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_blueprints_updated_at BEFORE UPDATE ON business_blueprints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ENABLE REALTIME
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE social_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE automations;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE business_blueprints;

-- =====================================================
-- ANALYTICS VIEWS
-- =====================================================
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
  u.id as user_id,
  u.email,
  COUNT(DISTINCT c.id) as total_clients,
  COUNT(DISTINCT CASE WHEN c.status = 'Active' THEN c.id END) as active_clients,
  COUNT(DISTINCT CASE WHEN c.status = 'Lead' THEN c.id END) as leads,
  COUNT(DISTINCT p.id) as total_payments,
  COALESCE(SUM(CASE WHEN p.status = 'Completed' THEN p.amount ELSE 0 END), 0) as total_revenue,
  COUNT(DISTINCT sp.id) as total_posts,
  COUNT(DISTINCT a.id) as total_automations
FROM auth.users u
LEFT JOIN clients c ON c.user_id = u.id
LEFT JOIN payments p ON p.user_id = u.id
LEFT JOIN social_posts sp ON sp.user_id = u.id
LEFT JOIN automations a ON a.user_id = u.id
GROUP BY u.id, u.email;
