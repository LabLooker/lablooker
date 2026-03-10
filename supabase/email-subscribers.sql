-- Email subscribers table for homepage email capture
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text DEFAULT 'homepage',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- RLS
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (the signup form)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admin) can read the list
CREATE POLICY "Authenticated users can read subscribers"
  ON email_subscribers FOR SELECT
  TO authenticated
  USING (true);
