DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_updated_at'
    ) THEN
        EXECUTE 'DROP TRIGGER set_updated_at ON Appointments';
    END IF;
END;
$$;


DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'update_updated_at_column'
    ) THEN
        EXECUTE 'DROP FUNCTION update_updated_at_column()';
    END IF;
END;
$$;