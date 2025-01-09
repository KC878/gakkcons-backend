DO $$
BEGIN
    
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE LOWER(table_name) = 'users' AND LOWER(column_name) = 'id_number'
    ) THEN
        ALTER TABLE users
        ADD id_number VARCHAR(100) UNIQUE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE LOWER(table_name) = 'users' AND LOWER(column_name) = 'mode'
    ) THEN
        ALTER TABLE users
        ADD mode VARCHAR(50);
    END IF;
END $$;
