-- Create Roles Table
CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

-- Create Users Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Create User Roles Table
CREATE TABLE User_Roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

-- Create Programs Table
CREATE TABLE Programs (
    program_id SERIAL PRIMARY KEY,
    program_name VARCHAR(100) NOT NULL
);

-- Create Subjects Table
CREATE TABLE Subjects (
    subject_id SERIAL PRIMARY KEY,
    program_id INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE
);

-- Create College Department Table
CREATE TABLE College_Department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_head_id INT,
    program_id INT,
    FOREIGN KEY (department_head_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE
);

-- Create Department Programs Table
CREATE TABLE Department_Programs (
    department_id INT NOT NULL,
    program_id INT NOT NULL,
    PRIMARY KEY (department_id, program_id),
    FOREIGN KEY (department_id) REFERENCES College_Department(department_id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE
);

-- Create User Subjects Table
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

-- Create Mode Table
CREATE TABLE Mode (
    mode_id SERIAL PRIMARY KEY,
    mode VARCHAR(50) NOT NULL
);

-- Create Status Table
CREATE TABLE Status (
    status_id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL
);

-- Create Appointments Table
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

-- Create userVerification Table with Foreign Key Reference
CREATE TABLE userVerification (
    user_id INT,
    code TEXT,
    is_verified BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);