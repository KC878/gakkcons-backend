INSERT INTO ROLES (role_name)
VALUES
    ('admin'),
    ('faculty'),
    ('student');

INSERT INTO programs (program_name)
VALUES 
    ('BSIT');

INSERT INTO College_Department (department_name)
VALUES 
    ('CITC');

WITH ProgramID AS (
    SELECT program_id
    FROM programs
    WHERE program_name = 'BSIT'
    LIMIT 1
)
INSERT INTO subjects (program_id, subject_name)
VALUES 
    ((SELECT program_id FROM ProgramID), 'Sys Ad'),
    ((SELECT program_id FROM ProgramID), 'Elective 3'),
    ((SELECT program_id FROM ProgramID), 'Elective 4'),
    ((SELECT program_id FROM ProgramID), 'Capstone'),
    ((SELECT program_id FROM ProgramID), 'SPI'),
    ((SELECT program_id FROM ProgramID), 'GNS');

INSERT INTO Department_Programs (department_id, program_id)
VALUES 
    ((SELECT department_id FROM College_Department WHERE department_name = 'CITC'),
     (SELECT program_id FROM programs WHERE program_name = 'BSIT'));

INSERT INTO mode (mode)
VALUES 
    ('online'),
    ('onsite');

INSERT INTO Status (status)
VALUES 
    ('Pending'),
    ('Confirmed'),
    ('Rescheduled'),
    ('Completed'),
    ('Cancelled'),
    ('No-Show'),
    ('In Progress'),
    ('Postponed'),
    ('Awaiting Confirmation'),
    ('Denied');
