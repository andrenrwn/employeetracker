// Function library to manage employeetracker_db

import db from '../config/connection.mjs';

/* Menu options
view all departments
view all roles
view all employees
add a department
add a role
add an employee
update employee role
 */

let alldepartments = [];
let allroles = [];
let allemployees = [];

export { alldepartments, allroles, allemployees };
