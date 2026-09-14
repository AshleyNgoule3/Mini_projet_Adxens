CREATE TYPE employee_status AS ENUM ('active', 'inactive');

CREATE TABLE employees (
    id          SERIAL PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    position    VARCHAR(100) NOT NULL,
    department  VARCHAR(100) NOT NULL,
    hire_date   DATE NOT NULL,
    status      employee_status NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Colonnes utilisees comme filtres par l'API (GET /api/employees) et par les
-- futurs tests de charge k6.
CREATE INDEX idx_employees_department ON employees (department);
CREATE INDEX idx_employees_status ON employees (status);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_employees_set_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
