// Import and require mysql2
import mysql from 'mysql2';

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'mysql',
    database: 'employeetracker_db'
  },
  console.log(`Connected to the employees_db database.`)
);

export default db;