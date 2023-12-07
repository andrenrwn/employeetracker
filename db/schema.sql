/*
# MySQL schema for the employee tracker database
#
# A new table "hierarchy" is created here to represent the many-to-one manager > employee relationship
# The schema provided suggests that an employee may have multiple managers, which will result in the employee duplicated when multiple managers are defined.
#
# So splitting the manager > employee relationship is required to normalize it, as arguably having a nullable manager_id might violate 1NF.
# ( per https://en.wikipedia.org/wiki/First_normal_form "A table with at least one nullable attribute." might not meet 1NF)
*/

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
