# Employee Tracker-MYSQL ![GitHub License](https://shields.io/badge/license-ISC-brightgreen)

## Description
    This is a command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.
## Tables of content:
  * [Installation](#installation)
  * [Usage](#usage)
  * [License](#license)
  * [Contributors](#contributors)
  * [Test](#test)
  * [Questions](#questions)

## Installation

1. Install NODE.js to run this application
2. Create a .gitignore file and include node_modules/ and .DS_Store/ so that your node_modules directory isn't tracked or uploaded to GitHub. Be sure to create your .gitignore file before installing any npm dependencies.
3. Make sure that your repo includes a package.json with the required dependencies. You can create one by running npm init when you first set up the project, before installing any dependencies.
4. Run command npm i inquirer@8.2.4 from the integrated terminal to install inquirer.js package dependency.
5. Run command npm npm install mysql2 to install mysql package to connect with database and perfrom queries.
6. Run command npm install console.table --save to print mysql rows to the console.  
7. Create database and insert data.
8. Run command mysql -u root to be in mysql.
9. Run command source db/schema.sql .
10. Run command source db/seeds.sql.
11. This application will be invoked by using the  command: node index.js.

## Usage 
  1. With the application invoked, you'll be prompted to choose from following options :
    * View all Departments
    * View all Roles
    * View all Employees
    * Add a Department
    * Add a Role
    * Add an Employee
    * Update an Employee Role
    * Update Employee Manager
    * View Employees By Manager
    * View Employees by Department
    * View total utilized budget of a Department
    * Delete a Department
    * Delete a Role
    * Delete a Employee
  2. WHEN  choosen to view all departments,
     THEN I am presented with a formatted table showing department names and department ids.
  3. WHEN  choosen to view all roles,
      THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role.
  4. WHEN  choosen to view all employees,
      THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
  5. WHEN  choosen to add a department,
      THEN I am prompted to enter the name of the department and that department is added to the database.
  6. WHEN  choosen to add a role,
      THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database.
  7. WHEN  choosen to add an employee,
      THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database.
  8. WHEN  choosen to update an employee role,
      THEN I am prompted to select an employee to update and their new role and this information is updated in the database.
  9. WHEN  choosen to Update Employee Manager,
       THEN I am prompted to select an employee to update manager and their new manager and this information is updated in the database.
  10. WHEN choosen to View Employees By Manager,
        THEN I am presented with a formatted table showing employees names and their manager.
  11. WHEN choosen to View Employees by Department,
        THEN I am presented with a formatted table showing employees names and their department names.
  12. WHEN choosen to View total utilized budget of a Department,
        THEN I am presented with a formatted table showing department names and totls budget of the department.
  13. WHEN choosen to Delete a Department,
        THEN I am prompted to enter the name of the department and that department is deleted from the database.
  14. WHEN choosen to Delete a Role,
        THEN I am prompted to enter the Role of the employee and that Role is deleted from the database.
  15. WHEN choosen to Delete an Employee,
        THEN I am prompted to enter the name of the employee and that Employee is deleted from the database.

## License  
* This application is licensed under : ![GitHub License](https://shields.io/badge/license-ISC-brightgreen)
* Click the link for the detailed license information: https://choosealicense.com/licenses/isc/

## Contributors
shruthi

## Test
npm test


## Questions
  * GitHub Username : shruthisalimath
  * Email: shruthi@test.com
  * GitHub profile : https://github.com/shruthisalimath 


## Mock Up
![Employee Tracker](./assets/Mockup-Employee-tracker.png)
(./assets/12-sql-homework-demo-01.png)

## ScreenShot
![Employee Tracker]()

## URL
1. Walkthrough video of Employee Tracker.


2. The URL of the GitHub repository.
  https://github.com/shruthisalimath/Employee-Management



