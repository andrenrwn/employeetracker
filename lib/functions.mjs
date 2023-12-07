// Function library to manage employeetracker_db

import db from '../config/connection.mjs';
import Table from 'cli-table';

/* Menu options
view all departments
view all roles
view all employees
add a department
add a role
add an employee
update employee role
 */

// Promisify an SQL query for mysql2's db.query()
// Guide: https://devdotcode.com/interact-with-mysql-database-using-async-await-promises-in-node-js/
let queryDB = (sqlQueryString, sqlParams = "") => {
    return new Promise(
        (resolve, reject) => {
            db.query(sqlQueryString, sqlParams, (error, results) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results);
                };
            });
        }
    );
};
// Traditional sql query call without promisification (callbacks required compared to the above)
// db.query(sqlquery, (err, rows, fields) => {
//     if (err) {
//         console.log(`error: ${err.message}`);
//         return;
//     }
//     console.log(`success: ${sqlquery} returned:\n ${JSON.stringify(rows)} \n ${JSON.stringify(fields)}`);
//     return rows;
// });

let getColumnNames = async function (tablename) {
    const sqlquery = `
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = ?
ORDER BY ORDINAL_POSITION;
`;
    let columns;
    try {
        columns = await queryDB(sqlquery, tablename);
    } catch (err) {
        console.log("Error in getColumnNames:", err);
    }
    return columns;
};

let getAllRows = async function (tablename) {
    // const sqlquery = `SELECT * FROM ?;`; // Use literal templates below because for some unknown reason (bug?) mysql2 adds quotes to parameterized queries 
    const sqlquery = `SELECT * FROM ${tablename};`;
    let allrows;
    try {
        allrows = await queryDB(sqlquery, tablename);
    } catch (err) {
        console.log("Error in getAllRows:", err);
    }
    return allrows;
};

let displayTable = async function (tablename) {
    let headers = (await getColumnNames(tablename)).map((element) => element.COLUMN_NAME);
    let rows = await getAllRows(tablename);
    // console.log(headers, rows); // debug

    let table = new Table({
        head: headers,
        style: {
            compact: true,
            head: ['yellow', 'bgBlue'],
        },
        //colWidths: [100, 200]
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    rows.forEach((elem) => table.push(Object.values(elem)));

    console.log(table.toString());
};

let getSQLQuery = async function (sqlQuery, queryParams) {
    let allrows;
    try {
        allrows = await queryDB(sqlQuery, queryParams);
    } catch (err) {
        console.log("Error in getSQLQuery:", err);
    }
    return allrows;
};

let displaySQLQueryTable = async function (sqlQuery, sqlParams = [], headers = []) {
    let rows = await getSQLQuery(sqlQuery, sqlParams);
    // console.log("HEADERS: ", headers, "ROWS------------", rows); // debug log

    let table = new Table({
        head: headers,
        style: {
            compact: true,
            head: ['yellow', 'bgBlue'],
        },
        //colWidths: [100, 200]
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    rows.forEach((elem) => {
        // if any element is null, convert it to a null string ( since cli-table doesn't handle null elements very well )
        table.push(Object.values(elem).map((elem) => elem == null ? "" : elem));
    });

    console.log(table.toString());
    return rows.length;
}

export { getColumnNames, getAllRows, displayTable, displaySQLQueryTable, getSQLQuery };
