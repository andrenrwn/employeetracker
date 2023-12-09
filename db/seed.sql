USE employeetracker_db;

INSERT INTO department (id, name)
VALUES 
(1, "Sales"),
(2, "Engineering"),
(3, "Finance"),
(4, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES 
(1, "Sales Lead", 100000, 1),
(2, "Salesperson", 80000, 1),
(3, "Lead Engineer", 150000, 2),
(4, "Software Engineer", 120000, 2),
(5, "Account Manager", 160000, 3),
(6, "Accountant", 125000, 3),
(7, "Legal Team Lead", 250000, 4),
(8, "Lawyer", 190000, 4),
(9, "Paper Programmer", 150000, 2),
(10, "Pencil Programmer", 150000, 2);

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES 
(1, "John", "Doe", 1),
(2, "Mike", "Chan", 2),
(3, "Ashley", "Rodriguez", 2),
(4, "Kevin", "Tupik", 4),
(5, "Kunal", "Singh", 5),
(6, "Malia", "Brown", 6),
(7, "Sarah", "Lourd", 7),
(8, "Tom", "Allen", 8),
(9, "Warner", "Bros", 3),
(10, "Tom", "Jerry", 9),
(11, "Daffy", "Bunny", 10),
(12, "Edsgar", "Djikstra", 3);

INSERT INTO hierarchy (id, manager_id)
VALUES
(2, 1),
(3, 1),
(4, 3),
(6, 5),
(8, 7),
(10,9),
(10,12),
(11,12),
(11,9);
