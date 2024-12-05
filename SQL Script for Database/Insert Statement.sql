
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



-------------------------------> 
Appointments part 




Populating Mode Table 

---> Mode

INSERT INTO mode (mode)
Values 
	('online'),
	('onsite');
	
	
	
	


Here’s a list of possible statuses for an "Appointment Consultation" system, based on common stages in such processes:

Pending - The appointment request has been made but is not yet confirmed.
Confirmed - The appointment has been confirmed by both the client and the provider.
Rescheduled - The appointment has been rescheduled to a different date or time.
Completed - The consultation has taken place.
Cancelled - The appointment was cancelled by the client or provider.
No-Show - The client did not attend the scheduled consultation.
In Progress - The consultation is currently happening.
Postponed - The consultation has been delayed but not cancelled.
Awaiting Confirmation - The appointment is awaiting confirmation from the provider or client.
Denied - The appointment request has been declined.

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




---- apppointment dummy


INSERT INTO Appointments
(
    student_id,
    faculty_id,
    mode_id,
    status_id,
    reason,
    scheduled_date,
    meet_link
) 
VALUES
(
    8,
    4,
    1,
    7,
    'Consult Grade',
    '2024-12-05 10:30:00',  -- Dummy scheduled_date
    'http://example.com/meeting-link'  -- Dummy meet_link
);
