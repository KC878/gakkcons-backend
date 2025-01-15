DO $$
BEGIN    
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reports') THEN
        CREATE TABLE Reports  (
            report_id SERIAL PRIMARY KEY,
            appointment_id INT NOT NULL,     
            student_id INT NOT NULL,              
            reporter_id INT NOT NULL,     
            report TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            currentDate TIMESTAMP,                         


            FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (reporter_id) REFERENCES Users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE

        );
    END IF;

END $$;
