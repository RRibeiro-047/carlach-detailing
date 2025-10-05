-- Update service_type constraint to use new package names
ALTER TABLE appointments 
DROP CONSTRAINT IF EXISTS appointments_service_type_check;

ALTER TABLE appointments 
ADD CONSTRAINT appointments_service_type_check 
CHECK (service_type IN ('basica', 'premium', 'detalhada'));

-- Update existing records to map old services to new packages
-- lavagem -> basica, polimento -> premium, vitrificacao -> detalhada
UPDATE appointments 
SET service_type = CASE 
  WHEN service_type = 'lavagem' THEN 'basica'
  WHEN service_type = 'polimento' THEN 'premium'
  WHEN service_type = 'vitrificacao' THEN 'detalhada'
  ELSE service_type
END
WHERE service_type IN ('lavagem', 'polimento', 'vitrificacao');
