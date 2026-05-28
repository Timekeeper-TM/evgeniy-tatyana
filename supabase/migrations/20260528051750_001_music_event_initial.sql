/*
  # Music Event Website Schema

  1. New Tables
    - `guests`
      - `id` (uuid, primary key)
      - `name` (text, guest name)
      - `email` (text, unique, guest email)
      - `phone` (text, optional phone number)
      - `attending` (boolean, RSVP status)
      - `guest_count` (integer, number of guests)
      - `message` (text, optional message from guest)
      - `created_at` (timestamp)
    - `song_requests`
      - `id` (uuid, primary key)
      - `guest_id` (uuid, foreign key to guests)
      - `song_title` (text)
      - `artist` (text)
      - `created_at` (timestamp)
    - `event_settings`
      - `id` (uuid, primary key)
      - `event_name` (text)
      - `event_date` (timestamp)
      - `venue_name` (text)
      - `venue_address` (text)
      - `venue_map_url` (text)
      - `main_artist_name` (text)
      - `main_artist_image` (text)
      - `main_artist_bio` (text)

  2. Security
    - Enable RLS on all tables
    - Allow public read access to event_settings
    - Allow authenticated and anonymous users to insert guests and song_requests
    - Users can only read their own guest entry and song requests
*/

-- Create guests table for RSVP submissions
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  attending boolean DEFAULT false,
  guest_count integer DEFAULT 1,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create song_requests table
CREATE TABLE IF NOT EXISTS song_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES guests(id) ON DELETE CASCADE,
  song_title text NOT NULL,
  artist text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create event_settings table
CREATE TABLE IF NOT EXISTS event_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text DEFAULT 'Music Festival 2024',
  event_date timestamptz DEFAULT '2024-12-31 20:00:00+00',
  venue_name text DEFAULT 'Grand Concert Hall',
  venue_address text DEFAULT '123 Music Lane, City',
  venue_map_url text DEFAULT '',
  main_artist_name text DEFAULT 'Featured Artist',
  main_artist_image text DEFAULT '',
  main_artist_bio text DEFAULT 'An incredible musical experience awaits...'
);

-- Enable RLS on all tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

-- Event settings policies (public read access)
CREATE POLICY "Public can read event settings"
  ON event_settings FOR SELECT
  USING (true);

-- Guest policies
CREATE POLICY "Anyone can create guest RSVP"
  ON guests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own guest entry"
  ON guests FOR SELECT
  USING (email = current_setting('request.jwt.claims->email', true));

-- Song request policies
CREATE POLICY "Anyone can create song request"
  ON song_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read their song requests"
  ON song_requests FOR SELECT
  USING (
    guest_id IN (
      SELECT id FROM guests WHERE email = current_setting('request.jwt.claims->email', true)
    )
  );

-- Insert default event settings
INSERT INTO event_settings (event_name, event_date, venue_name, venue_address)
VALUES (
  'Summer Beats Festival 2026',
  '2026-08-15 19:00:00+00',
  'Crystal Arena',
  '45 Harmony Boulevard, Music City, MC 12345'
) ON CONFLICT DO NOTHING;