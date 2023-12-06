# MySQL schema for the employee tracker database
#
# This variation uses a table called hierarchy to represent the many-to-one manager > employee relationship
# This is done because arguably having a nullable manager_id might violate 1NF

DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL,
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
