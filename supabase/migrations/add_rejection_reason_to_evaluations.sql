-- Adiciona coluna rejection_reason à tabela evaluations
ALTER TABLE evaluations
ADD COLUMN rejection_reason TEXT;

-- Adiciona comentário na coluna
COMMENT ON COLUMN evaluations.rejection_reason IS 'Motivo da rejeição quando status=rejected';
