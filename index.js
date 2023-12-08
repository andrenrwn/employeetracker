/*******************************************************
Employee Tracker
A command-line employeetracker_db MySQL database manager
*******************************************************/

import { input, select, confirm, Separator } from '@inquirer/prompts';
import { promises as fs } from 'fs';
import { getSQLQuery, getColumnNames, getAllRows, displayTable, displaySQLQueryTable } from './lib/functions.mjs';
import { ETDepartments, ETRoles, ETEmployees } from './lib/tabledisplay.mjs';
import db from './config/connection.mjs';
import Table from 'cli-table';
import colors from 'colors';

let DepartmentTable = new ETDepartments();
let RoleTable = new ETRoles();
let EmployeeTable = new ETEmployees();

// Define menu selections
let choices = [
    new Separator(), // View
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
        name: "View Employees by Manager",
        value: "view_employees_by_manager",
        description: "View employees by manager",
    },
    {
        name: "View Employees of a Manager",
        value: "view_employees_of_manager",
        description: "View employees managed by a manager",
    },
    {
        name: "View Employee Budgets of Departments",
        value: "view_salaries_by_department",
        description: "View combined salaries of all employees by department",
    },
    new Separator(), // Add
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
    new Separator(), // Update
    {
        name: "Update Employee Role",
        value: "update_employee_role",
        description: "Update an employee's role",
    },
    {
        name: "Update Employee Manager",
        value: "update_employee_manager",
        description: "Update an employee's manager",
    },
    new Separator(), // Delete
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
        name: "quit",
        value: "quit",
        description: "Quit program",
    },
];

// Let users choose a department
let chooseadepartment = async function (promptmessage = "Select a department\n") {
    let deptchoices = await DepartmentTable.getrows();
    deptchoices.push({ name: '<Cancel>', value: -1, description: "Cancel and return" });
    let deptchoice = await select(
        {
            message: promptmessage,
            choices: deptchoices,
            pageSize: deptchoices.length,
            loop: true,
        });
    // console.log(deptchoices); // debug log
    let chosendept = deptchoices.find((elem) => { return elem.value === deptchoice });
    return { deptchoice, chosendept };
};

// Let the user choose a role
let choosearole = async function (promptmessage = "Select a role\n") {
    let rolechoices = await RoleTable.getrows();
    rolechoices.push({ name: '<Cancel>', value: -1, description: "Cancel and return" });
    let rolechoice = await select(
        {
            message: promptmessage,
            choices: rolechoices,
            pageSize: rolechoices.length,
            loop: true,
        });
    // console.log(rolechoices); // debug log
    let chosenrole = rolechoices.find((elem) => { return elem.value === rolechoice });
    return { rolechoice, chosenrole };
};

// Let the user choose an employee
let chooseanemployee = async function (promptmessage = "Select an employee\n") {
    let employeechoices = await EmployeeTable.getrows();
    employeechoices.push({ name: '<Cancel>', value: -1, description: "Cancel and return" });
    let employeechoice = await select(
        {
            message: promptmessage,
            choices: employeechoices,
            pageSize: employeechoices.length,
            loop: true,
        });
    // console.log(employeechoices); // debug log
    let chosenemployee = employeechoices.find((elem) => { return elem.value === employeechoice });
    return { employeechoice, chosenemployee };
};

// Add a new department
async function add_department() {
    // display department
    // await displaySQLQueryTable(`SELECT * FROM department ORDER BY department.id`, "", ['Department Id', 'Department']);
    console.log("\nADD A DEPARTMENT".inverse);
    await DepartmentTable.show();

    const newdeptname = await input({ message: 'Enter new department name' });

    // We already have a UNIQUE constraint to the query, but check manually anyway for a better error message

    if (await DepartmentTable.exists(newdeptname)) {
        console.log(`Error: ${newdeptname} department already exists`.error);
    } else {
        if (await DepartmentTable.add(newdeptname)) {
            console.log("\nREFRESHED DEPARTMENT LIST".inverse);
            await DepartmentTable.show();
            console.log(`Added ${newdeptname}`.yellow.inverse);
        };
    };

    // display department the old way before refactor
    // console.log("DEPARTMENT");
    // await displaySQLQueryTable(`SELECT * FROM department ORDER BY department.id`, "", ['Department Id', 'Department']);
};

// Add a new role
async function add_role() {
    console.log("\nCURRENT ROLES".inverse);
    await RoleTable.show();

    const newroletitle = await input({ message: 'Enter new role title: ' });
    const newrolesalary = await input({ message: 'Enter a salary for the new role: ' });

    // Get department selection
    let { deptchoice, chosendept } = await chooseadepartment("Select a department for the new role:\n");
    if (deptchoice < 0) {
        console.log("Cancelling add role".inverse);
        return;
    };

    if (await RoleTable.exists(newroletitle, deptchoice)) {
        console.log(`Error: Role title ${newroletitle} already exists in the ${chosendept.name} department`.red.inverse);
    } else {
        if (await RoleTable.add(newroletitle, newrolesalary, deptchoice)) {
            console.log("\nREFRESHED ROLES".inverse);
            await RoleTable.show();
            console.log(`Added ${newroletitle} with a salary of ${newrolesalary} to ${deptchoice}`.yellow.inverse);
        };
    };
};

async function add_employee() {
    console.log("\nADD AN EMPLOYEE".inverse);
    await EmployeeTable.show();

    const firstname = await input({ message: "Enter the employee's first name: " });
    const lastname = await input({ message: "Enter the employee's last name: " });

    // Get department selection
    let { rolechoice, chosenrole } = await choosearole("Select a department for the new role:\n");
    if (rolechoice < 0) {
        console.log("Cancelling add employee".inverse);
        return;
    };

    if (await EmployeeTable.exists(firstname, lastname, rolechoice)) {
        // console.log(`Error: Employee ${firstname} ${lastname} in ${((rolechoices.find((elem) => elem.value === rolechoice))).description} already exists`.red.inverse);
        console.log(`Error: Employee ${firstname} ${lastname} in ${chosenrole.description} already exists`.red.inverse);
    } else {
        if (await EmployeeTable.add(firstname, lastname, rolechoice)) {
            console.log("\nREFRESHED EMPLOYEE LIST".inverse);
            await EmployeeTable.show();
            //console.log(`Added ${firstname} ${lastname} as ${(rolechoices.find((elem) => elem.value === rolechoice)).description}`.yellow.inverse);
            console.log(`Added ${firstname} ${lastname} as ${chosenrole.description}`.yellow.inverse);
        };
    };
};

// Update employee role.
async function update_employee_role() {
    console.log("\nCURRENT EMPLOYEE LIST".inverse);
    await EmployeeTable.show();

    let { employeechoice, chosenemployee } = await chooseanemployee("Select an employee to update to the new role:\n");
    if (employeechoice < 0) {
        console.log("Cancelling employee role update".inverse);
        return;
    };

    let { rolechoice, chosenrole } = await choosearole(`Select a new role for employee ${chosenemployee.description}:\n`);
    if (rolechoice < 0) {
        console.log("Cancelling employee role update".inverse);
        return;
    };

    // let rolechoices = await RoleTable.getrows();
    // let rolechoice = await select(
    //     {
    //         message: `Select a new role for employee ${chosenemployee.description}:\n`,
    //         choices: rolechoices,
    //         pageSize: rolechoices.length,
    //         loop: true,
    //     });
    // let chosenrole = rolechoices.find((elem) => elem.value === rolechoice);

    console.log("CHOSEN EMPLOYEE:", chosenemployee);
    console.log("CHOSEN ROLE:", chosenrole);

    let employeeexists = await EmployeeTable.exists(chosenemployee.first_name, chosenemployee.last_name, rolechoice);
    console.log("employee exists:", employeeexists);
    if (employeeexists) {
        console.log(`Error: Employee ${chosenemployee.first_name} ${chosenemployee.last_name} in ${chosenrole.description} already exists`.red.inverse);
    } else {
        console.log("trying calling updaterole with", employeechoice, rolechoice);

        let updateresult;
        try {
            updateresult = await EmployeeTable.updaterole(employeechoice, rolechoice);
        } catch (err) {
            console.log(`Error updating result with `.red, result);
        };
        if (updateresult) {
            console.log("\nREFRESHED EMPLOYEE LIST".inverse);
            await EmployeeTable.show();
            console.log(`Updated ${chosenemployee.first_name} ${chosenemployee.last_name} to ${chosenrole.description}`.yellow.inverse);
        };
    };
};

// Update employee's manager.
// Note: per specifications, an employee can have many managers.
//       Locgically, a manager can have many employees, I think the assignment is backwards, creating a many-many relationship
async function update_employee_manager() {
    console.log("\nCURRENT EMPLOYEE LIST".inverse);
    await EmployeeTable.show();

    const updatechoice = await select({
        message: "Select how you want to update an employee's manager",
        choices: [
            {
                name: 'Assign manager',
                value: 'newmanager',
                description: 'Assign (add) a new manager to employee (employee can have multiple managers)',
            },
            {
                name: 'Unassign manager',
                value: 'delmanager',
                description: 'Unassign (remove) a manager from an employee',
            },
            {
                name: 'Back',
                value: 'back',
                description: 'Return to main menu',
            },
        ],
    });

    let employeechoice, chosenemployee, managerchoice, chosenmanager, managersofemployee;

    switch (updatechoice) {
        case 'newmanager':

            ({ employeechoice, chosenemployee } = await chooseanemployee("Select an employee:\n"));
            if (employeechoice < 0) {
                console.log("Cancelling employee manager update".inverse);
                return;
            };

            console.log("CHOSEN EMPLOYEE:\n".inverse, chosenemployee);

            // The following object destructuring is a bit unreadable, but the following essentially means:
            //   managerchoice = (the return value of chooseanemployee).employeechoice
            //   chosenmanager = (the return value of chooseanemployee).chosenemployee
            // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
            ({ employeechoice: managerchoice, chosenemployee: chosenmanager } = await chooseanemployee("Select a manager to assign\n"));
            if (managerchoice < 0) {
                console.log("Cancelling manager update".inverse);
                return;
            };
            console.log("CHOSEN MANAGER:".inverse, managerchoice, chosenmanager);

            // Checks & validations
            // Check if the employee is already assigned to the manager
            managersofemployee = (await EmployeeTable.getmanagers(employeechoice)).map((elem) => elem.id);
            if (managersofemployee.includes(managerchoice)) {
                console.log(`The employee is already assigned to ${chosenmanager.name}, cancelling manager assignment`.inverse);
                return;
            };

            // If the employee and the manager is the same, check with the user
            if (employeechoice == managerchoice) {
                if (await confirm({
                    message: 'Warning: Chosen employee and manager is the same, continue?',
                    default: false
                })) {
                    console.log("Continuing to assigning new manager to employee".inverse);
                } else {
                    console.log("Cancelling manager assignment".inverse);
                    return;
                };
            };

            await EmployeeTable.addmanager(employeechoice, managerchoice);

            console.log("\nREFRESHED EMPLOYEE LIST".inverse);
            await EmployeeTable.show();

            break;

        case 'delmanager':

            ({ employeechoice, chosenemployee } = await chooseanemployee("Select an employee:\n"));
            if (employeechoice < 0) {
                console.log("Cancelling employee manager delete".inverse);
                return;
            };
            console.log("CHOSEN EMPLOYEE:".inverse, employeechoice, chosenemployee);

            // Inquirer prompt to select manageres
            let managersofemployeechoices = (await EmployeeTable.getmanagers(employeechoice)).map((elem) => { return { name: elem.name, value: elem.id, description: elem.name } });

            // Different cases if employee has no manager, one manager, or multiple managers
            if (managersofemployeechoices.length === 0) {
                console.log("Employee has no manager".red);
                return;
            } else if (managersofemployeechoices.length === 1) {
                managerchoice = managersofemployeechoices[0].value;
            } else if (managersofemployeechoices.length >= 2) {
                managerchoice = await select(
                    {
                        message: "Choose a manager to unassign from this employee",
                        choices: managersofemployeechoices,
                        pageSize: managersofemployeechoices.length,
                        loop: true
                    });
            } else {
                console.log("Error, unexpected condition".red);
                return;
            };

            await EmployeeTable.delmanager(employeechoice, managerchoice);

            console.log("\nREFRESHED EMPLOYEE LIST".inverse);
            await EmployeeTable.show();

            break;

        default:
    };

};

async function delete_department() {
    console.log("\nDELETE A DEPARTMENT".inverse);
    await DepartmentTable.show();

    // Get department selection
    let { deptchoice, chosendept } = await chooseadepartment("Select a department for the new role:\n");
    if (deptchoice < 0) {
        console.log("Cancelling delete department".inverse);
        return;
    };
    console.log("CHOSEN DEPARTMENT TO DELETE:\n".inverse, chosendept);
    DepartmentTable.del(deptchoice);
    await DepartmentTable.show();
    console.log(`\nDEPARTMENT ${chosendept.name} DELETED`.inverse);
};

async function delete_role() {
    console.log("\nDELETE A ROLE".inverse);
    await RoleTable.show();

    let { rolechoice, chosenrole } = await choosearole("Select a role to delete:\n");
    if (rolechoice < 0) {
        console.log("Cancelling delete role".inverse);
        return;
    };
    console.log("CHOSEN ROLE TO DELETE:\n".inverse, chosenrole);
    RoleTable.del(rolechoice);
    await RoleTable.show();
    console.log(`\nROLE ${chosenrole.name} DELETED`.inverse);
};

async function delete_employee() {
    console.log("\nDELETE EMPLOYEE".inverse);
    await EmployeeTable.show();

    let { employeechoice, chosenemployee } = await chooseanemployee("Select an employee too delete:\n");
    if (employeechoice < 0) {
        console.log("Cancelling delete employee".inverse);
        return;
    };
    console.log("CHOSEN EMPLOYEE TO DELETE:\n".inverse, chosenemployee);
    EmployeeTable.del(employeechoice);
    await EmployeeTable.show();
    console.log(`\nEMPLOYEE ${chosenemployee.name} DELETED`.inverse);
};


// the main while loop menu for a user to select tasks
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
        case "view_departments":
            // await displayTable("department", "name"); // non-class function
            console.log("\nVIEW DEPARTMENTS".inverse);
            await DepartmentTable.show();
            break;

        case "view_roles":
            console.log("\nVIEW EMPLOYEE ROLES".inverse);
            await RoleTable.show();
            break;

        case "view_employees":
            console.log("\nVIEW EMPLOYEES".inverse);
            await EmployeeTable.show();
            break;

        case "view_employees_by_manager":
            console.log("\nVIEW EMPLOYEES BY MANAGER".inverse);
            await EmployeeTable.show_by_manager();
            break;

        case "view_employees_of_manager":
            console.log("\nVIEW EMPLOYEES BY MANAGER".inverse);
            break;

        case "add_department":
            await add_department();
            break;

        case "add_role":
            await add_role();
            break;

        case "add_employee":
            await add_employee();
            break;

        case "update_employee_role":
            await update_employee_role();
            break;

        case "update_employee_manager":
            await update_employee_manager();
            break;

        case "delete_department":
            await delete_department();
            break;

        case "delete_role":
            await delete_role();
            break;

        case "delete_employee":
            await delete_employee();
            break;

        case "quit":
            console.log("Quitting");
            process.exit();
            break;
        default:
    };
} while (answer !== "quit");

// Exit main loop / program
