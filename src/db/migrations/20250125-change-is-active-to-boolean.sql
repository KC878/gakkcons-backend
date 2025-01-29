DO $$
DECLARE is_active_data_type TEXT;
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE LOWER(table_name) = 'users' AND LOWER(column_name) = 'is_active'
    ) THEN
  
        SELECT data_type INTO is_active_data_type 
        FROM information_schema.columns 
        WHERE LOWER(table_name) = 'users' 
        AND LOWER(column_name) = 'is_active';

        IF is_active_data_type = 'integer' THEN
            ALTER TABLE users ALTER COLUMN is_active DROP DEFAULT;

            ALTER TABLE users ALTER COLUMN is_active TYPE BOOLEAN USING (is_active = 1);

            ALTER TABLE users ALTER COLUMN is_active SET DEFAULT FALSE;
        END IF;
    ELSE
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
