
-- Populate Roles
INSERT INTO ROLES (role_name)
VALUES
    ('admin'),
    ('faculty'),
    ('student');


----------- Create a dummy acc for teacher
INSERT INTO users (password, first_name, last_name, email)
VALUES (
    'password',
    'Sir',
    'Rojo',
    'rojo@gmail.com'
);


--- whatever was registered
INSERT INTO user_roles 
Values (4, 2);


INSERT INTO programs (program_name)
Values ('BIST');


---- Subjects

Insert Into subjects (program_id, subject_name)
Values 
	(1, 'Sys Ad'), 
	(1, 'Elective 3'),
	(1, 'Elective 4'),
	(1, 'Capstone'),
	(1, 'SPI'),
	(1, 'GNS');



----- Department
Insert Into College_Department 
(department_name, department_head_id, program_id)
Values(
	'CITC', '4', '1'
);



INSERT INTO Department_Programs
Values (
	1, 1
); -- referencing first created department_id and program_id