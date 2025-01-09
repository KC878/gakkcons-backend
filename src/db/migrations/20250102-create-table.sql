DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roles') THEN
        CREATE TABLE Roles (
            role_id SERIAL PRIMARY KEY,
            role_name VARCHAR(50) NOT NULL
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE Users (
            user_id SERIAL PRIMARY KEY,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100),
            email VARCHAR(100) UNIQUE NOT NULL
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        CREATE TABLE User_Roles (
            user_id INT NOT NULL,
            role_id INT NOT NULL,
            PRIMARY KEY (user_id, role_id),
            FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'programs') THEN
        CREATE TABLE Programs (
            program_id SERIAL PRIMARY KEY,
            program_name VARCHAR(100) NOT NULL
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subjects') THEN
        CREATE TABLE Subjects (
            subject_id SERIAL PRIMARY KEY,
            program_id INT NOT NULL,
            subject_name VARCHAR(100) NOT NULL,
            FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'college_department') THEN
        CREATE TABLE College_Department (
            department_id SERIAL PRIMARY KEY,
            department_name VARCHAR(100) NOT NULL,
            department_head_id INT,
            program_id INT,
            FOREIGN KEY (department_head_id) REFERENCES Users(user_id) ON DELETE SET NULL,
            FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'department_programs') THEN
        CREATE TABLE Department_Programs (
            department_id INT NOT NULL,
            program_id INT NOT NULL,
            PRIMARY KEY (department_id, program_id),
            FOREIGN KEY (department_id) REFERENCES College_Department(department_id) ON DELETE CASCADE,
            FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_subjects') THEN
        CREATE TABLE User_Subjects (
            user_id INT NOT NULL,
            subject_id INT NOT NULL,
            semester VARCHAR(10),
            enrolling_year INT,
            school_year VARCHAR(20),
            PRIMARY KEY (user_id, subject_id),
            FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mode') THEN
        CREATE TABLE Mode (
            mode_id SERIAL PRIMARY KEY,
            mode VARCHAR(50) NOT NULL
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'status') THEN
        CREATE TABLE Status (
            status_id SERIAL PRIMARY KEY,
            status VARCHAR(50) NOT NULL
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        CREATE TABLE Appointments (
            appointment_id SERIAL PRIMARY KEY,
            student_id INT NOT NULL,
            faculty_id INT NOT NULL,
            mode_id INT NOT NULL,
            status_id INT NOT NULL,
            reason TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            scheduled_date TIMESTAMP,
            meet_link VARCHAR(255),
            FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (faculty_id) REFERENCES Users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (mode_id) REFERENCES Mode(mode_id) ON DELETE CASCADE,
            FOREIGN KEY (status_id) REFERENCES Status(status_id) ON DELETE CASCADE
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_verifications') THEN
        CREATE TABLE User_Verifications (
            user_verification_id SERIAL PRIMARY KEY,  
            user_id INT NOT NULL,                     
            code TEXT NOT NULL,                       
            expiration_time TIMESTAMP NOT NULL,
            code_type TEXT NOT NULL,     
            FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
        );
    END IF;
END $$;
