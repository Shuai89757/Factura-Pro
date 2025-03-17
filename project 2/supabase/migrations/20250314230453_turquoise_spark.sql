/*
  # Create invoices table and setup RLS policies

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `invoice_number` (text)
      - `date` (date)
      - `issuer_data` (jsonb)
      - `client_data` (jsonb)
      - `items` (jsonb)
      - `tax_rate` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `invoices` table
    - Add policies for authenticated users to:
      - Read their own invoices
      - Create new invoices
      - Update their own invoices
      - Delete their own invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  invoice_number text NOT NULL,
  date date NOT NULL,
  issuer_data jsonb NOT NULL,
  client_data jsonb NOT NULL,
  items jsonb NOT NULL,
  tax_rate numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy for reading own invoices
CREATE POLICY "Users can read own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for creating invoices
CREATE POLICY "Users can create invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating own invoices
CREATE POLICY "Users can update own invoices"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting own invoices
CREATE POLICY "Users can delete own invoices"
  ON invoices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();