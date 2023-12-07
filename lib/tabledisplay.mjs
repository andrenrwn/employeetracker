// Display tables for the user interface

import db from '../config/connection.mjs';
import Table from 'cli-table';
import { getSQLQuery, getColumnNames, getAllRows, displayTable, displaySQLQueryTable } from './functions.mjs';


class ShowTable {
    constructor({ header = [], sqlQuery = "", sqlParam = [] } = {}) {
        this.header = header;
        this.sqlQuery = sqlQuery;
        this.sqlParam = sqlParam;
    };
    show() {
    };
};

class ShowDepartments extends ShowTable {
    constructor({ header = ['Department Id', 'Department'],
        sqlQuery = `SELECT * FROM department ORDER BY department.id`,
        sqlParam = [] } = {}) {
        super(header, sqlQuery, sqlParam);
        this.header = header;
        this.sqlQuery = sqlQuery;
        this.sqlParam = sqlParam;
    };
    async show() {
        console.log("DEPARTMENTS\n");
        // await displayTable("department");
        await displaySQLQueryTable(this.sqlQuery, "", this.header);
    };
};

class ShowRoles extends ShowTable {
    constructor({ header = ['Role id', 'Title', 'Salary', 'Department'],
        sqlQuery = `
                    SELECT role.id, role.title, role.salary, department.name
                    FROM role 
                    INNER JOIN department ON role.department_id = department.id
                    ORDER BY role.id;`,
        sqlParam = [] } = {}) {
        super(header, sqlQuery, sqlParam);
        this.header = header;
        this.sqlQuery = sqlQuery;
        this.sqlParam = sqlParam;
    };
    async show() {
        console.log("ROLES\n");
        await displaySQLQueryTable(this.sqlQuery, "", this.header);
    };
};

class ShowEmployees extends ShowTable {
    constructor({ header = ['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'],
        sqlQuery = `
                  SELECT emp1.id, 
                         emp1.first_name, 
                         emp1.last_name, 
                         role.title, 
                         department.name, 
                         role.salary, 
                         CONCAT(emp2.first_name, ' ', emp2.last_name) as manager
                  FROM (((employee AS emp1 INNER JOIN role ON emp1.role_id = role.id) 
                                           INNER JOIN department ON role.department_id = department.id) 
                                           LEFT JOIN hierarchy ON emp1.id = hierarchy.id) 
                                           LEFT JOIN employee AS emp2 ON hierarchy.manager_id = emp2.id ORDER BY emp1.id`,
        sqlParam = [] } = {}) {
        super(header, sqlQuery, sqlParam);
        this.header = header;
        this.sqlQuery = sqlQuery;
        this.sqlParam = sqlParam;
    };
    async show() {
        console.log("EMPLOYEES\n");
        // await displayTable("employee");
        await displaySQLQueryTable(this.sqlQuery, "", this.header);
        // console.log("TABLE LENGTH:", tblength); // debug log
    };
};

export { ShowDepartments, ShowRoles, ShowEmployees };
