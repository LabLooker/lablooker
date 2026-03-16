-- Admin setup: add is_admin column and grant admin to Rosa
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Replace with the actual admin email
UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@here.com');
