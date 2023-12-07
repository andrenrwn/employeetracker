
DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL,
  UNIQUE KEY roledepartment(title, department_id),
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id int,
  FOREIGN KEY (role_id) REFERENCES role(id),
  PRIMARY KEY (id)
);

CREATE TABLE hierarchy (
  id INT NOT NULL,
  manager_id INT NOT NULL,
  FOREIGN KEY (id) REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (id, manager_id)
);

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
(7, "Legal Team Lead", 250000, 1),
(8, "Lawyer", 190000, 1);

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES 
(1, "John", "Doe", 1),
(2, "Mike", "Chan", 1),
(3, "Ashley", "Rodriguez", 1),
(4, "Kevin", "Tupik", 4),
(5, "Kunal", "Singh", 5),
(6, "Malia", "Brown", 6),
(7, "Sarah", "Lourd", 7),
(8, "Tom", "Allen", 8);

INSERT INTO hierarchy (id, manager_id)
VALUES
(2, 1),
(4, 3),
(6, 5),
(8, 7);

﻿