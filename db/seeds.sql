INSERT INTO department (name)
VALUES ("sales"), ("Engineering"), ("Finance"), ("Marketing"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 10000, 1),
       ("Sales Lead", 20000, 1),
       ("Web Developer", 60000, 2),
       ("Software Engineer", 75000, 2),
       ("Accountant", 40000, 3),
       ("Account Manager", 55000, 3),
       ("HR Manager", 65000, 4),
       ("Marketing Manager", 70000, 4),
       ("Lawyer", 85000, 5),
       ("Legal Team Lead", 80000, 5),
       ("Teaching", 90000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Tom", "Allen", 2, 1 ),
       ("Kira", "Nerys", 3, NULL),
       ("Ray", "Charles", 4, 3),
       ("Roger", "Waters", 5, NULL),
       ("Robert", "Plant", 6, 5),
       ("Ann", "Wilson", 7, NULL),
       ("Simon", "Tarses", 8, 7),
       ("louis", "philip", 9, NULL),
       ("john", "Abraham", 10, 1);
       
