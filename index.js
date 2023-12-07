/*******************************************************
Employee Tracker
A command-line employeetracker_db MySQL database manager
*******************************************************/

import { input, select, Separator } from '@inquirer/prompts';
import { promises as fs } from 'fs';
import { getSQLQuery, getColumnNames, getAllRows, displayTable, displaySQLQueryTable } from './lib/functions.mjs';
import { ShowDepartments, ShowRoles, ShowEmployees } from './lib/tabledisplay.mjs';
import db from './config/connection.mjs';
import Table from 'cli-table';


let DepartmentTable = new ShowDepartments();
let RoleTable = new ShowRoles();
let EmployeeTable = new ShowEmployees();

/* Menu options
view all departments
view all roles
view all employees
add a department
add a role
add an employee
update employee role
 */

// Define menu selections
let choices = [
    new Separator(), // common sections in README files
    {
        name: "View Departments",
        value: "view_departments",
        description: "View all departments",
    },
    {
        name: "View Roles",
        value: "view_roles",
        description: "View all employment roles",
    },
    {
        name: "View Employees",
        value: "view_employees",
        description: "View all employees",
    },
    {
        name: "Add Department",
        value: "add_department",
        description: "Add a new department",
    },
    {
        name: "Add Role",
        value: "add_role",
        description: "Add a new employment role",
    },
    {
        name: "Add Employee",
        value: "add_employee",
        description: "Add an employee",
    },
    {
        name: "Update Employee Role",
        value: "update_employee_role",
        description: "Update an employee's role",
    },
    new Separator(), // uncommon sections
    {
        name: "Update Employee Manager",
        value: "update_employee_manager",
        description: "Update an employee's manager",
    },
    {
        name: "View Employees by Manager",
        value: "view_employees_by_manager",
        description: "View employees by manager",
    },
    new Separator(), // uncommon sections
    {
        name: "Delete Department",
        value: "delete_department",
        description: "Delete a department",
    },
    {
        name: "Delete Role",
        value: "delete_role",
        description: "Delete a role",
    },
    {
        name: "Delete Employee",
        value: "delete_employee",
        description: "Delete an employee",
    },
    new Separator(),
    {
        name: "View Employee Budgets of Departments",
        value: "view_salaries_by_department",
        description: "View combined salaries of all employees by department",
    },
    new Separator(),
    {
        name: "quit",
        value: "quit",
        description: "Quit program",
    },
];

// a while loop menu for user to select options to add to the logo
let answer;
let tblength = 0;
do {
    answer = await select({
        message: "Select an option:\n",
        choices: choices,
        pageSize: choices.length,
        loop: true,
    });
    console.log("Selected: ", answer);

    switch (answer) {
        case "view_departments":
            // console.log("DEPARTMENTS");
            // // await displayTable("department");
            // await displaySQLQueryTable(`SELECT * FROM department ORDER BY department.id`, "", ['Department Id', 'Department']);
            await DepartmentTable.show();
            break;

        case "view_roles":
            // console.log("ROLES");
            // // await displayTable("role");
            // const view_roles_query = `SELECT role.id, role.title, role.salary, department.name FROM role 
            //                 INNER JOIN department ON role.department_id = department.id ORDER BY role.id;`;
            // await displaySQLQueryTable(view_roles_query, "", ['Role id', 'Title', 'Salary', 'Department']);
            await RoleTable.show();
            break;

        case "view_employees":
            // console.log("EMPLOYEES");
            // // await displayTable("employee");
            // const view_employees_query = `
            // SELECT emp1.id, 
            //        emp1.first_name, 
            //        emp1.last_name, 
            //        role.title, 
            //        department.name, 
            //        role.salary, 
            //        CONCAT(emp2.first_name, ' ', emp2.last_name) as manager
            // FROM (((employee AS emp1 INNER JOIN role ON emp1.role_id = role.id) 
            //                          INNER JOIN department ON role.department_id = department.id) 
            //                          LEFT JOIN hierarchy ON emp1.id = hierarchy.id) 
            //                          LEFT JOIN employee AS emp2 ON hierarchy.manager_id = emp2.id ORDER BY emp1.id`;
            // await displaySQLQueryTable(view_employees_query, "", ['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager']);
            // console.log("TABLE LENGTH:", tblength);
            await EmployeeTable.show();
            break;

        case "add_department":
            // display department
            // console.log("DEPARTMENT");
            // await displaySQLQueryTable(`SELECT * FROM department ORDER BY department.id`, "", ['Department Id', 'Department']);
            await DepartmentTable.show();

            const newdeptname = await input({ message: 'Enter new department name' });
            const query_department_name = `SELECT * FROM department WHERE name = '${newdeptname}';`;
            const dept_exists = await getSQLQuery(query_department_name, "");
            if (dept_exists.length > 0) {
                console.log(`Error: ${newdeptname} department already exists`);
            } else {
                try {
                    await getSQLQuery("INSERT INTO department (name) VALUES (?)", [newdeptname]);
                } catch (err) {
                    console.log("Error adding department:", err);
                };
            };

            // display department
            // console.log("DEPARTMENT");
            // await displaySQLQueryTable(`SELECT * FROM department ORDER BY department.id`, "", ['Department Id', 'Department']);
            await DepartmentTable.show();
            break;
        case "add_role":
            break;
        case "add_employee":
            break;
        case "septagon":
            break;
        case "octagon":
            break;
        case "polygon":
            break;
        case "setcolor":
            break;
        case "quit":
            console.log("Quitting");
            process.exit();
            break;
        default:
    };
} while (answer !== "quit");

