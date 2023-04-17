const inquirer = require('inquirer');
const questions = [   
    {
        type: 'list',
        message: 'WHat would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role'
        ],
        name: 'selection'
    }
]
const cTable = require('console.table')
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user:'root',
        password:'root',
        database: 'employee_chart_db'
    },
    console.log('Connected to the employee_chart_db database\n\n')
)

db.query(`
    SELECT e.id,e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employees e
    JOIN roles r ON e.role_id = r.id
    JOIN departments d on d.id = r.department_id
    LEFT JOIN employees m ON e.manager_id = m.id;`,
    function (err, results) {
        console.table(results);
        
});

db.query(`
    SELECT *
    FROM employee_chart_db.departments
    ORDER BY name ASC;`,
    function (err, results) {
        console.table(results);
        
});

db.query(`
SELECT * FROM employee_chart_db.roles`,
    function (err, results) {
        console.table(results);
        
});

inquirer
.prompt(questions)