-- Add date_of_birth to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth TEXT;

-- Update the profile creation trigger to also capture date_of_birth from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, date_of_birth)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'date_of_birth'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    date_of_birth = COALESCE(EXCLUDED.date_of_birth, profiles.date_of_birth);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
