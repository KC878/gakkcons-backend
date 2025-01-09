SELECT 'CREATE DATABASE db_gakkcons'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'db_gakkcons')\gexec