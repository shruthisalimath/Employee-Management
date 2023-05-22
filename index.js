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
                "Update Employee Manager",
                "View Employees By Manager",
                "View Employees by Department",
                "View total utilized budget of a Department",
                "Delete a Department",
                "Delete a Role",
                "Delete a Employee",
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
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
                case "View Employees By Manager":
                    ViewEmployeesByManager();
                    break;
                case "View Employees by Department":
                    ViewEmployeesByDepartment();
                    break;
                case "View total utilized budget of a Department":
                    ViewBudgetByDepartment();
                    break;
                case "Delete a Department":
                    removeDepartment();
                    break;
                case "Delete a Role":
                    removeRole();
                    break;
                case "Delete a Employee":
                    removeEmployee();
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
             CONCAT(emp.first_name, ' ', emp.last_name) As Manager from employee \
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
            name: "department_name",
            validate: nameInput => {
              if (nameInput) {
                  return true;
              }else {
                  console.log('please enter department name!');
                  return false;
              }
            }
        },
    ]).then((res) => {
        db.query("INSERT INTO department SET ?",
            {
                name: res.department_name,
            },
            (err) => {
                if (err) throw err;
            });
        console.log("Successfully Added New Department! = " + res.department_name);
        console.log("");
        viewAllDepartments();
    });
};

// Add New Role
function addRole() {
    db.query("SELECT * FROM department;", (err, res) => {
        if (err) throw err;
        const pickDepartment = res.map((department) => {
            return {
                value: department.id,
                name: department.name,
            };
        });
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter a title for new role",
                name: "role_title",
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
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
                    } else {
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
                console.log("Successfully Added New Role! = " + res.role_title);
                console.log("");
                viewAllRoles();
            });
    });
};

//Add New Employee
function addEmployee() {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        const pickRole = res.map((role) => {
            return {
                value: role.id,
                name: role.title,
            };
        });
        db.query("SELECT * FROM employee", (err, res) => {
            if (err) throw err;
            const pickManager = res.map((manager) => {
                return {
                    value: manager.id,
                    name: manager.first_name + " " + manager.last_name,
                };
            });
            pickManager.push({
                name: "none",
                value: null
            });
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please first name of the new employee",
                    name: "firstName",
                    validate: firstInput => {
                        if (firstInput) {
                            return true;
                        } else {
                            console.log('please enter the First Name!');
                            return false;
                        }
                    }
                },
                {
                    type: "input",
                    message: "Please last name of the new employee",
                    name: "lastName",
                    validate: lastInput => {
                        if (lastInput) {
                            return true;
                        } else {
                            console.log('please enter the Last Name!');
                            return false;
                        }
                    }
                },
                {
                    type: "list",
                    message: "Please select employee Role",
                    name: "empRole",
                    choices: pickRole,
                },
                {
                    type: "list",
                    message: "Please select employee Manager",
                    name: "empManager",
                    choices: pickManager,
                },
            ])
                .then((res) => {
                    db.query("INSERT INTO employee SET ?",
                        {
                            first_name: res.firstName,
                            last_name: res.lastName,
                            role_id: res.empRole,
                            manager_id: res.empManager
                        },
                        (err) => {
                            if (err) throw err;
                        });
                    console.log("Successfully Added New Employee! = " + res.firstName + " " + res.lastName);
                    console.log("");
                    viewAllEmployees();
                });
        });
    });
};

//Update employee by Role
function updateEmployeeRole() {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const pickEmployee = res.map((employee) => {
            return {
                value: employee.id,
                name: employee.first_name + " " + employee.last_name,
            };
        });
        db.query("SELECT * FROM role", (err, res) => {
            if (err) throw err;
            const pickRole = res.map((role) => {
                return {
                    value: role.id,
                    name: role.title,
                };
            });
            inquirer.prompt([
                {
                    type: "list",
                    message: "Select an employee to update a Role",
                    name: "updateEmployee",
                    choices: pickEmployee
                },
                {
                    type: "list",
                    message: "Select a New Role",
                    name: "updateRole",
                    choices: pickRole
                }
            ])
                .then((res) => {
                    console.log(res);
                    db.query("UPDATE employee SET role_id = ? WHERE id =?",
                        [
                            res.updateRole,
                            res.updateEmployee,
                        ],
                        (err) => {
                            if (err) throw err;
                        });
                    console.log("Successfully Updated  New Employee Role!");
                    console.log("");
                    viewAllEmployees();
                });
        });
    });
};

//Update Employee by Manager
function updateEmployeeManager() {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const pickEmployee = res.map((employee) => {
            return {
                value: employee.id,
                name: employee.first_name + " " + employee.last_name,
                manager: employee.manager_id
            };
        });
        db.query("SELECT* FROM employee", (err, res) => {
            if (err) throw err;
            const pickManager = res.map((manager) => {
                return {
                    value: manager.id,
                    name: manager.first_name + " " + manager.last_name,
                };
            });
            pickManager.push({
                name: "none",
                value: null
            });
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Select an employee to update manager',
                    name: 'updateEmployee',
                    choices: pickEmployee
                },
                {
                    type: 'list',
                    message: 'Select a new Manager',
                    name: 'updateManager',
                    choices: pickManager
                },
            ])
                .then((res) => {
                    console.log(res);
                    db.query("UPDATE employee SET manager_id = ? WHERE id =?",
                        [
                            res.updateManager,
                            res.updateEmployee,
                        ],
                        (err) => {
                            if (err) throw err;
                        });
                    console.log("Successfully Updated  New Manager!");
                    console.log("");
                    viewAllEmployees();
                });
        });
    });

};

//View Employee by manager
function ViewEmployeesByManager() {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const pickManager = res.map((employee) => {
            return {
                value: employee.id,
                name: employee.first_name + " " + employee.last_name,
            };
        });
        pickManager.push({
            name: "none",
            value: null
        });
        inquirer.prompt([
            {
                type: "list",
                message: "pick a manager ",
                name: "manager",
                choices: pickManager
            },
        ])
            .then((res1) => {
                db.query("select emp.first_name,\
                            emp.last_name,\
                            role.title as job_title,\
                            dept.name as department_name,\
                            concat(mgr.first_name, ' ', mgr.last_name) as manager_name \
                    from employee emp \
                    left join role as role on role.id = emp.role_id \
                    left join department as dept on dept.id = role.department_id \
                    left join employee as mgr on mgr.id = emp.manager_id \
                    where emp.manager_id = ?",
                    [res1.manager], (err, res1) => {
                        if (err) throw err;
                        console.log("");
                        console.table(res1);
                        empPrompts();
                    });
            });
    });
};

//View employee By department
function ViewEmployeesByDepartment() {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const pickDepartment = res.map((department) => {
            return {
                value: department.id,
                name: department.name,
            };
        });
        inquirer.prompt([
            {
                type: "list",
                message: "Pick a Department",
                name: "department",
                choices: pickDepartment,
            }
        ])
            .then((res) => {
                db.query(`SELECT employee.id,\
                         employee.first_name,\
                         employee.last_name,\
                         role.title As job_title,\
                         department.name As department_name,\
                         CONCAT(emp.first_name, " ", emp.last_name) as Manager FROM employee\
                         LEFT JOIN role ON role.id = employee.role_id\
                         LEFT JOIN department on department.id = role.department_id\
                         LEFT JOIN employee As emp on employee.manager_id = emp.id WHERE department.id = ?`,
                    [res.department], (err, res) => {
                        if (err) throw err;
                        console.log("");
                        console.table(res);
                        empPrompts();
                    });

            });
    });

};

//View total utilized budget of a Department
function ViewBudgetByDepartment() {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const deptBudget = res.map((department) => {
            return {
                value: department.id,
                name: department.name,
            };
        });
        inquirer.prompt([
            {
                type: "list",
                message: "Pick a Department",
                name: "department",
                choices: deptBudget,
            }
        ])
            .then((res) => {
                db.query("SELECT  department.name AS department_name,\
                    SUM(role.salary) AS TOTAL_BUDGET\
                    FROM (role INNER JOIN department ON role.department_id = department.id)\
                    INNER JOIN employee ON role.id = employee.role_id\
                    WHERE department.id = ?\
                    GROUP BY department.name",
                    res.department, (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        empPrompts();
                    });
            })
    });
};

//Delete Department
function removeDepartment() {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const deleteDept = res.map((toDeleteDept) => {
            return {
                value: toDeleteDept.id,
                name: toDeleteDept.name,
            };
        });
        inquirer.prompt([
            {
                type: "list",
                message: "Select a Department to Delete",
                name: "delDept",
                choices: deleteDept,
            }
        ])
            .then((res) => {

                db.query("DELETE FROM department WHERE id = ?",
                    res.delDept, (err, res) => {
                        if (err) throw err;
                        // console.table(res);
                        console.log("Successfully Deleted choosen Department! = " + res.delDept);
                        console.log("");
                        viewAllDepartments();
                    });
            });
    });
};

//Delete Role
function removeRole() {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        const deleteRole = res.map((toDeleteRole) => {
            return {
                value: toDeleteRole.id,
                name: toDeleteRole.title,
            };
        });
        inquirer.prompt([
            {
                type: "list",
                message: "Select a Role to Delete",
                name: "delRole",
                choices: deleteRole,
            },
        ])
            .then((res) => {
                db.query("DELETE FROM role WHERE id = ?",
                    res.delRole, (err, res) => {
                        if (err) throw err;
                        console.log("Successfully Deleted  Role!");
                        console.log("Deleted Role: " + res.delRole);
                        console.log("");
                        viewAllRoles();
                    });
            });
    });
};

//Delete Employee
function removeEmployee() {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const delEmployee = res.map((toDelEmp) => {
            return {
                value: toDelEmp.id,
                name: toDelEmp.first_name + ' ' + toDelEmp.last_name,
            };
        })
        inquirer.prompt([
            {
                type: 'list',
                message: "Select an Employee to Delete",
                name: "delEmp",
                choices: delEmployee
            },
        ])
            .then((res) => {
                db.query("DELETE FROM employee where id = ?",
                    res.delEmp, (err, res) => {
                        if (err) throw err;
                        console.log("Successfully Deleted  Employee!");
                        console.log("");
                        viewAllEmployees();
                    });
            });
    });
};
