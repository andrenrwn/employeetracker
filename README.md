# Employee Tracker

![Employee Tracker](img/employeetracker.png)

## Description

This is an employee tracker, demonstrating a command-line NodeJS application to manage data on a MySQL database.

## Repository

[https://github.com/andrenrwn/employeetracker](https://github.com/andrenrwn/employeetracker)

## Installation

- nodeJS (if not yet installed)
- clone this repository
- npm install

## Usage

Local run:

```$ node index.js```

### Main Menu

The program presents the user with the following options.

![Employee Tracker Main Menu](img/main_menu.png)

Use the up and down arrow to select an option.
Press <enter> to select.

A <cancel> selection will back out to the main menu.

Selecting quit will exit the program.

### View Department

View all departments.

![View all departments](img/01_view_departments.png)

### View Department Employees

Select a department to view that department's employees.

![View Department Employees](img/02_view_department_employees.png)

### View the personnel budget of each department 

View the sum of all salaries of employees that belong to each department.
The table also displays an employee count of each department.

![View department employee budget report](img/03_view_department_employee_budget.png)

### Add a department

Enter the department's name when prompted.

![Add a department](img/04_add_department.png)

### Delete a department

![Delete a department](img/05_delete_department.png)

### View All Roles

View all employee titles (roles)

![View all roles](img/06_view_roles.png)

### Add Role

Add an employee role (title), 
enter the role's salary,
then select a department that hosts that role.

![Add role](img/07_add_role.png)

Salary only accepts numeric entries.

![Salary is numeric](img/07_add_role_validation.png)

### Delete Role

Select a role to delete it.
If an employee is currently assigned the deleted role, the employee's role will be NULL.

![Delete a role](img/08_delete_role.png)

### View Employees

Views all employees, their roles, salaries, and manager (if assigned).

![View Employees](img/09_view_employees.png)

### View Employees by Manager

View all employees, sorted by their manager in charge.
An employee can have multiple managers, in which case that employee will be displayed twice in the table so all their managers can be displayed.

![View Employees by Manager](img/10_view_employees_by_manager.png)

### View Manager Direct Reports

Select a manager to view their direct reports.

![Select and view a manager's direct reports](img/11_view_manager_direct_reports.png)

### Add Employee

Add an employee.
Enter their first name, last name, and select their work role.

![Add Employee](img/12_add_employee.png)

### Update Employee Role

Update the employee's role.
Select the employee to update, then select a new role for that employee.

![Update employee Role](img/13_update_employee_role.png)

### Modify Employee Manager

You can assign a new manager to an employee, or remove the manager assignment from an employee.

![Modify Employee Manager](img/14_modify_employee_manager.png)

### Delete Employee

You can also delete an employee from the database.

![Delete Employee](img/15_delete_employee.png)



## License

[MIT](LICENSE)

## Dependencies and Credits

The following are the npm dependencies of this application:

- inquirer  : https://github.com/SBoudrias/Inquirer.js
- mysql2    : https://github.com/sidorares/node-mysql2
- cli-table : https://github.com/Automattic/cli-table
- colors    : https://github.com/Qix-/color

Ideas and code patterns are provided from the UT Austin Coding Bootcamp challenges.
