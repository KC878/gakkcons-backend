DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE LOWER(table_name) = 'users' AND LOWER(column_name) = 'is_active'
    ) THEN
        ALTER TABLE users
        ADD is_active INT DEFAULT 0;
    END IF;
END $$;
