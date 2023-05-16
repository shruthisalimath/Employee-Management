const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');

//set connection to database
const db = mysql.createConnection ({
    host: 'localhost',
    // MySQL Username
    user: 'root',
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

//checking the established connection
db.connect(err => {
    if (err) throw err;
    console.log(`------------------------------------`);
    console.log(`          Employee Tracker          `);
    console.log(`------------------------------------`);
    empPrompts();
});

//prompt questions
function empPrompts() {
    inquirer.prompts ([
        {
            type: 'list',
            name: `userChoice`,
            message: `what would you like to do?`,
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Add a Department",
                "Add a Roll",
                "Add an Employee",
                "Update an Employee Role",
                "View Employees by Department",
                
            ]

        }
    ])
}