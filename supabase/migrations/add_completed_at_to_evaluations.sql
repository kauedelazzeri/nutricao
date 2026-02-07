-- Adiciona coluna completed_at à tabela evaluations
ALTER TABLE evaluations
ADD COLUMN completed_at TIMESTAMPTZ;

-- Adiciona comentário na coluna
COMMENT ON COLUMN evaluations.completed_at IS 'Data/hora em que a avaliação foi finalizada (status=completed)';
