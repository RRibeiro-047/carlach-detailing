-- Create appointments table for Carlach Detailing
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  car_model VARCHAR(255) NOT NULL,
  car_size VARCHAR(20) NOT NULL CHECK (car_size IN ('sedan', 'suv', 'caminhonete')),
  service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('lavagem', 'polimento', 'vitrificacao')),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'finalizado', 'cancelado')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(phone);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE
  ON appointments FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
