// Import and require mysql2
import mysql from 'mysql2';

// Connect to database
export const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'mysql',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);
