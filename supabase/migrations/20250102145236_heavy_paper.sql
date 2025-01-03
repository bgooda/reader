/*
  # Create translations table

  1. New Tables
    - `translations`
      - `id` (uuid, primary key)
      - `original_text` (text)
      - `translated_text` (text)
      - `language` (text)
      - `context` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `translations` table
    - Add policies for authenticated users to read and create translations
*/

CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text text NOT NULL,
  translated_text text NOT NULL,
  language text NOT NULL,
  context text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read translations"
  ON translations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create translations"
  ON translations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);