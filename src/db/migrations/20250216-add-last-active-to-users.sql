DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE LOWER(table_name) = 'users' AND LOWER(column_name) = 'last_active'
    ) THEN
        EXECUTE 'ALTER TABLE Users ADD COLUMN last_active TIMESTAMP WITH TIME ZONE';
    END IF;
END;
$$;
