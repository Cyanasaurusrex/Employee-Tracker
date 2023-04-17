INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, department, salary)
VALUES ("Sales Lead", "Sales", 100000),
       ("Salesperson", "Sales", 80000),
       ("Lead Engineer", "Engineering", 150000),
       ("Software Engineer", "Engineering", 120000),
       ("Account Manager", "Finance", 160000),
       ("Accountant", "Finance", 125000),
       ("Legal Team Lead", "Legal", 250000),
       ("Lawyer", "Legal", 190000);

INSERT INTO employees (first_name, last_name, title, manager)
VALUES ("John", "Doe", "Sales Lead", NULL),
       ("Mike", "Chan", "Salesperson", "John Doe"),
       ("Ashley", "Rodriguez", "Lead Engineer", NULL),
       ("Kevin", "Tupik", "Software Engineer", "Ashley Rodriguez"),
       ("Kunal", "Singh", "Account Manager", NULL),
       ("Malia", "Brown", "Accountant", "Kunal Singh"),
       ("Sarah", "Lourd", "Legal Team Lead", NULL),
       ("Tom", "Allen", "Lawyer", "Sarah Lourd");