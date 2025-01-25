DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE LOWER(table_name) = 'users' AND LOWER(column_name) = 'is_active'
    ) THEN
  
        ALTER TABLE users ALTER COLUMN is_active DROP DEFAULT;

        ALTER TABLE users ALTER COLUMN is_active TYPE BOOLEAN USING (is_active = 1);

        ALTER TABLE users ALTER COLUMN is_active SET DEFAULT FALSE;
    ELSE
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
