const fs = require('fs');
const inquirer = require('inquirer');
const table = require('console.table');
const mysql = require('mysql2');

//set connection to database
const db = mysql.createConnection({
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
    //console.log("calling empprompts from  dbconnect:");
    empPrompts();
});

//prompt questions
function empPrompts() {
    inquirer.prompt([
        {
            type: 'list',
            name: `userChoice`,
            message: `what would you like to do?`,
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
                "View Employees by Department",
                "View utilized budget by Department",
                "Delete an Employee",
                "Delete a Role",
                "Delete a Department",
                "EXIT"
            ]
        }
    ])
        .then((res) => {
            console.log(res.userChoice);
            switch (res.userChoice) {
                case "View all Departments":
                    viewAllDepartments();
                    break;
                case "View all Roles":
                    viewAllRoles();
                    break;
                case "View all Employees":
                    viewAllEmployees();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Update an Employee Role":
                    UpdateEmployeeRole();
                    break;
                case "View Employees by Department":
                    ViewEmployeesByDepartment();
                    break;
                case "View utilized budget by Department":
                    ViewBudgetByDepartment();
                    break;
                case "Delete an Employee":
                    removeEmployee();
                    break;
                case "Delete a Role":
                    removeRole();
                    break;
                case "Delete a Department":
                    removeDepartment();
                    break;
                case "EXIT":
                    db.end();
                    break;
                default:
                    console.log("Error has occured");
                    db.end();
                    break;
            }
        }).catch((err) => {
            if (err) throw err;
        });
};

//View Department
function viewAllDepartments() {
    //select from db
    db.query("select * from Department;", (err, res) => {
        if (err) throw err;
        console.table("All Departments: ", res);
        empPrompts();
    });
};

//View All Roles
function viewAllRoles() {
    //select from db
    db.query("select role.id As role_id,\
               role.title As job_title,\
               role.salary,\
               d.name As department_name from role\
               join department as d on role.department_id = d.id;",
        (err, res) => {
            if (err) throw err;
            console.table("All Roles: ", res);
            empPrompts();
        });
};

//View All Employee
function viewAllEmployees() {
    //select from db
    db.query("select employee.id As emp_id,\
             employee.first_name,\
             employee.last_name,\
             role.title As job_title,\
             role.salary,\
             department.name As department_name,\
             CONCAT(emp.first_name, ' ', emp.last_name) As Manager from employee As employee\
             LEFT JOIN role on role.id = employee.role_id\
             LEFT JOIN department on department.id = role.department_id\
             LEFT JOIN employee As emp on employee.manager_id = emp.id\
             order by employee.id;", (err, res) => {
        if (err) throw err;
        console.table("All Employees : ", res);
        empPrompts();
    });
};

//Add a new department
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "please enter department name: ",
            name: "department_name"
            /*validate: nameInput => {
              if (nameInput) {
                  return true;
              }else {
                  console.log('please enter department name!');
                  return false;
              }
            }*/
        },
    ]).then((res) => {
        db.query("INSERT INTO department SET ?",
            {
                name: res.department_name,
            },
            (err) => {
                if (err) throw err;
            });
                console.log("Successfully Added New Department!");
                console.log("");
                viewAllDepartments();
        });
};

// Add New Role
function addRole() {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const pickDepartment = res.map((department) => {
            return { 
                value: department.id,
                name: department.name,
            };
        });
        inquirer.prompt ([
            {
                type: "input",
                message: "Please enter a title for new role",
                name: "role_title",
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    }else {
                        console.log('please enter role title!');
                        return false;
                    }
                }
            },
            {
                type: "input",
                message: "Please enter a salary for role",
                name: "role_salary",
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    }else {
                        console.log('please enter role salary!');
                        return false;
                    }
                }
            },
            {
                type: "list",
                message: "please select department for this role",
                name: "departmentId", 
                choices: pickDepartment,
            },
        ])
        .then((res) => {
            db.query("INSERT INTO role SET ?",
                {
                    title: res.role_title,
                    salary: res.role_salary,
                    department_id: res.departmentId
                },
                (err) => {
                    if (err) throw err;
                });
                    console.log("Successfully Added New Role!");
                    console.log("");
                    viewAllRoles();
        });
    });
};

//Add Employee

    