/*******************************************************
Employee Tracker
A command-line employeetracker_db MySQL database manager
*******************************************************/

import { input, select, Separator } from '@inquirer/prompts';
import { promises as fs } from 'fs';
import { alldepartments, allroles, allemployees } from './lib/functions.mjs';
import db from './config/connection.mjs';

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
do {
    answer = await select({
        message: "Select an option:\n",
        choices: choices,
        pageSize: choices.length,
        loop: true,
    });
    console.log("Selected: ", answer);

    switch (answer) {
        case "text":
            break;
        case "circle":
            break;
        case "triangle":
            break;
        case "square":
            break;
        case "pentagon":
            break;
        case "hexagon":
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

