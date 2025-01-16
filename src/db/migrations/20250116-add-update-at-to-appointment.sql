DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE LOWER(table_name) = 'appointments' AND LOWER(column_name) = 'updated_at'
    ) THEN
        EXECUTE 'ALTER TABLE Appointments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_updated_at'
    ) THEN
        EXECUTE '
            CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON Appointments
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column()';
    END IF;
END;
$$;
