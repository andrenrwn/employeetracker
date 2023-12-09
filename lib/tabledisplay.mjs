// Classes to manage the database tables for the user interface

// Classes:
//  ETTable
//    ETDepartments
//    ETRoles
//    ETEmployees

import { getSQLQuery, getColumnNames, getAllRows, displayTable, displaySQLQueryTable, isNumeric } from './functions.mjs';
// import db from '../config/connection.mjs'; // db is used in functions.mjs
// import Table from 'cli-table'; // cli-table used in functions.mjs
import colors from 'colors';

class ETTable {
    constructor({ header = [], sqlQuery = "", sqlParam = [] } = {}) {
        this.header = header;
        this.sqlQuery = sqlQuery;
        this.sqlParam = sqlParam;
    };
    // show displays the table
    show() { };
    // adds a row
    add() { };
    // queries if something exists
    exists() { };
    // gets the entire table from the db into an object/array
    getrows() { };
    // delete something
    del() { };
};

class ETDepartments extends ETTable {
    constructor({ header = ['Department Id', 'Department'],
        sqlQuery = `SELECT * FROM department ORDER BY department.id`,
        sqlParam = [] } = {}) {
        super(header, sqlQuery, sqlParam);
        this.header = header;
        this.sqlQuery = sqlQuery;
        this.sqlParam = sqlParam;
    };
    async show() {
        // await displayTable("department");
        await displaySQLQueryTable(this.sqlQuery, "", this.header);
    };
    async exists(deptname) {
        const query_department_name = `SELECT * FROM department WHERE name = '${deptname}';`;
        const dept_exists = await getSQLQuery(query_department_name, "");
        return (dept_exists.length > 0);
    };
    async add(deptname) {
        try {
            await getSQLQuery("INSERT INTO department (name) VALUES (?)", [deptname]);
        } catch (err) {
            console.log("Error adding department:".error, err);
            return false;
        };
        return true;
    };
    // method to return an array of inquirer choices
    async getrows() {
        let allrows;
        try {
            allrows = await getAllRows("department");
        } catch (err) {
            console.log("Error while getting department names".error);
        };
        return allrows.map((elem) => {
            return { name: elem.name, value: elem.id, description: `${elem.name} department` };
        });
    };
    // delete a department by id
    async del(id) {
        try {
            await getSQLQuery("DELETE FROM department WHERE department.id = ?;", [id]);
        } catch (err) {
            console.log("Error deleting department:".error, err);
            return false;
        };
        return true;
    };
    async show_employee_budget() {
        const header = ['Department', '# Employees in Department', 'Salary Budget'];
        const sqlQuery = `
        SELECT department.name, COUNT(employee.id), SUM(role.salary)
        FROM((employee LEFT JOIN role ON employee.role_id = role.id) 
        LEFT JOIN department ON role.department_id = department.id)
		GROUP BY department.name;
        `;
        await displaySQLQueryTable(sqlQuery, "", header);
    };
};

class ETRoles extends ETTable {
    constructor({ header = ['Role id', 'Title', 'Salary', 'Department'],
        sqlQuery = `
                    SELECT role.id, role.title, role.salary, department.name
                    FROM role 
                    LEFT JOIN department ON role.department_id = department.id
                    ORDER BY role.id;`,
        sqlParam = [] } = {}) {
        super(header, sqlQuery, sqlParam);
        this.header = header;
        this.sqlQuery = sqlQuery;
        this.sqlParam = sqlParam;
    };
    async show() {
        await displaySQLQueryTable(this.sqlQuery, "", this.header);
    };
    async exists(roletitle, departmentid) {
        const query_role_title_dept = `SELECT * FROM role WHERE title = '${roletitle}' AND department_id = ${parseInt(departmentid)};`;
        const role_exists = await getSQLQuery(query_role_title_dept, "");
        return (role_exists.length > 0);
    };
    async add(roletitle, rolesalary, departmentid) {
        try {
            await getSQLQuery("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [roletitle, rolesalary, departmentid]);
        } catch (err) {
            console.log("Error adding role:".error, err);
            return false;
        };
        return true;
    };
    // method to return an array of roles into inquirer choices
    async getrows() {
        let allrows;
        try {
            allrows = await getSQLQuery(`SELECT role.id AS id, role.title AS title, department.name AS name 
                                         FROM role 
                                         LEFT JOIN department ON role.department_id = department.id;`);
        } catch (err) {
            console.log("Error while getting the role list".error);
        };
        return allrows.map((elem) => {
            return {
                name: elem.title, value: elem.id, description: `Title: ${elem.title} (Department: ${elem.name})`, department: `${elem.name}`
            };
        });
    };
    // Delete a role by id
    async del(id) {
        try {
            await getSQLQuery("DELETE FROM role WHERE role.id = ?;", [id]);
        } catch (err) {
            console.log("Error deleting role:".error, err);
            return false;
        };
        return true;
    };
};

class ETEmployees extends ETTable {
    constructor({ header = ['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'],
        sqlQuery = `
        SELECT emp1.id, 
            emp1.first_name, 
            emp1.last_name, 
            role.title, 
            department.name AS department_name, 
            role.salary, 
            CONCAT(emp2.first_name, ' ', emp2.last_name) as manager
        FROM (((employee AS emp1 LEFT JOIN hierarchy ON emp1.id = hierarchy.id) 
            LEFT JOIN employee AS emp2 ON hierarchy.manager_id = emp2.id) 
            LEFT JOIN role ON emp1.role_id = role.id) 
            LEFT JOIN department ON role.department_id = department.id;
        `,
        sqlParam = [] } = {}) {
        super(header, sqlQuery, sqlParam);
        this.header = header;
        this.sqlQuery = sqlQuery;
        this.sqlParam = sqlParam;
    };
    async show() {
        // await displayTable("employee");
        await displaySQLQueryTable(this.sqlQuery, "", this.header);
        // console.log("TABLE LENGTH:", tblength); // debug log
    };
    async show_by_manager() {
        const header = ['Manager', 'ID', 'First Name', 'Last Name', 'Title', 'Department'];
        const sqlQuery = `
        SELECT
            CONCAT(emp2.first_name, ' ', emp2.last_name) as manager,
            emp1.id as employee_id, 
            emp1.first_name, 
            emp1.last_name, 
            role.title, 
            department.name as department
        FROM (((employee AS emp1 
        LEFT JOIN role ON emp1.role_id = role.id) 
        LEFT JOIN department ON role.department_id = department.id) 
        LEFT JOIN hierarchy ON emp1.id = hierarchy.id) 
        LEFT JOIN employee AS emp2 ON hierarchy.manager_id = emp2.id
        ORDER BY manager;
        `;
        await displaySQLQueryTable(sqlQuery, "", header);
    };
    async show_by_department(department_id) {
        const header = ['ID', 'First Name', 'Last Name', 'Title', 'Salary', 'Manager'];
        const sqlQuery = `
        SELECT emp1.id, 
            emp1.first_name, 
            emp1.last_name, 
            role.title, 
            role.salary, 
            CONCAT(emp2.first_name, ' ', emp2.last_name) as manager
        FROM (((employee AS emp1 LEFT JOIN hierarchy ON emp1.id = hierarchy.id) 
            LEFT JOIN employee AS emp2 ON hierarchy.manager_id = emp2.id) 
            LEFT JOIN role ON emp1.role_id = role.id)
		WHERE role.department_id = ?
        ORDER BY emp1.id;
        `;
        await displaySQLQueryTable(sqlQuery, [department_id], header);
    };
    async show_direct_reports(manager_id) {
        const header = ['Employee ID', 'First Name', 'Last Name', 'Title', 'Department'];
        const sqlQuery = `
        SELECT employee.id, 
               first_name, 
               last_name, 
               role.title, 
               department.name
        FROM ((hierarchy INNER JOIN employee ON hierarchy.id = employee.id) 
                         LEFT JOIN role ON employee.role_id = role.id) 
                         LEFT JOIN department ON role.department_id = department.id
        WHERE hierarchy.manager_id = ?;`
        await displaySQLQueryTable(sqlQuery, [manager_id], header);
    };
    async exists(firstname, lastname, roleid) {
        const query_employee_role_dept = `SELECT * FROM employee WHERE first_name = ? AND last_name = ? AND role_id = ?`;
        const employee_exists = await getSQLQuery(query_employee_role_dept, [firstname, lastname, roleid]);
        return (employee_exists.length > 0);
    };
    async add(firstname, lastname, roleid) {
        try {
            // console.log("Adding to employee: ", firstname, lastname, roleid); // debug log
            await getSQLQuery("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [firstname, lastname, roleid]);
            // await getSQLQuery(`INSERT INTO employee (first_name, las_tname, role_id) VALUES (${firstname}, ${lastname}, ${roleid})`);
        } catch (err) {
            console.log("Error adding employee:".error, err);
            return false;
        };
        return true;
    };
    // method to return an array of roles into inquirer choices
    async getrows() {
        let allrows;
        try {
            allrows = await getSQLQuery(`SELECT employee.id AS id, 
                                                employee.first_name AS first_name,
                                                employee.last_name AS last_name,
                                                CONCAT(employee.first_name, ' ', employee.last_name) AS name, 
                                                role.title AS title 
                                        FROM employee
                                        LEFT JOIN role ON employee.role_id = role.id
                                        ORDER BY first_name, last_name;
            `);
        } catch (err) {
            console.log("Error while getting the role list".error);
        };
        return allrows.map((elem) => {
            return {
                name: elem.name,
                value: elem.id,
                description: `id ${elem.id}: ${elem.name} (${elem.title})`,
                first_name: `${elem.first_name}`,
                last_name: `${elem.last_name}`
            };
        });
    };
    // update role of employee
    async updaterole(employeeid, roleid) {
        let result;
        try {
            result = await getSQLQuery('UPDATE employee SET employee.role_id = ?  WHERE employee.id = ?;', [roleid, employeeid]);
            // console.log("updaterole() Result: ".orange, result); // debug logs
        } catch (err) {
            console.log("Error updating role: ".red, err);
            return false;
        };
        return true;
    };
    async addmanager(employeeid, managerid) {
        let result;
        try {
            result = await getSQLQuery('INSERT INTO hierarchy (id, manager_id) VALUES (?, ?);', [employeeid, managerid]);
        } catch (err) {
            console.log("Error adding manager to employee: ", err);
            return false;
        };
        return true;
    };
    async delmanager(employeeid, managerid) {
        let result;
        try {
            result = await getSQLQuery('DELETE FROM hierarchy WHERE id = ? AND manager_id = ?;', [employeeid, managerid]);
        } catch (err) {
            console.log("Error deleting employee manager: ", err);
            return false;
        };
        return true;
    };
    async getmanagers(employeeid) {
        let result;
        try {
            // results like [ { id: 10, name: 'Tom Jerry' }, { id: 11, name: 'Bugs Daffy' } ]
            const sqlquery = `SELECT manager_id AS id,
                                     CONCAT(employee.first_name, ' ', employee.last_name) AS name 
                              FROM hierarchy 
                              INNER JOIN employee ON employee.id = hierarchy.manager_id 
                              WHERE hierarchy.id = ? ;`;
            // alternative: results like [ 10, 11 ]
            // const sqlquery = 'SELECT * FROM hierarchy WHERE id = ? ;'
            result = await getSQLQuery(sqlquery, [employeeid]);
        } catch (err) {
            console.log("Error querying managers: ", err);
            return [];
        };
        // result is an array of manager IDs
        //return result.map((elem) => elem.manager_id);
        // result is an array of manager objects [ { id: 10, name: 'Tom Jerry' }, { id: 11, name: 'Bugs Daffy' } ]
        return result;
    };
    // Delete employee by id
    async del(id) {
        try {
            await getSQLQuery("DELETE FROM employee WHERE employee.id = ?;", [id]);
        } catch (err) {
            console.log("Error deleting role:".error, err);
            return false;
        };
        return true;
    };
};

export { ETDepartments, ETRoles, ETEmployees };
