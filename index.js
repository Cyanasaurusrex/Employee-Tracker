const inquirer = require('inquirer');
const cTable = require('console.table')
const mysql = require('mysql2');

const questions = [   
    {
        type: 'list',
        message: 'WHat would you like to do?',
        choices: [
            
        ],
        name: 'selection'
    }
]


const db = mysql.createConnection(
    {
        host: 'localhost',
        user:'root',
        password:'root',
        database: 'employee_chart_db'
    },
    console.log('Connected to the employee_chart_db database\n\n')
)


async function mainMenu() {
    let choice = '';
    while (choice !== 'Exit') {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'menuChoice',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
          ]
        }
      ]);
      choice = answer.menuChoice;
      switch (choice) {


        // view all departments
        case 'View all departments':
            try {
                const [rows, fields] = await db.promise().query(`
                SELECT *
                FROM employee_chart_db.departments
                ORDER BY name ASC;
                `);
                console.table(rows);        
            } catch (err) {
                console.error(err);
            }
            break;


        // View all roles
        case 'View all roles':
            try {
                const [rows, fields] = await db.promise().query(`
                    SELECT * FROM employee_chart_db.roles`);
                    console.table(rows)
            } catch (err) {
                console.error(err)
            }
            break;


        // View all employees
        case 'View all employees':
            try {
                const [rows, fields] = await db.promise().query(`
                  SELECT e.id,e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                  FROM employees e
                  JOIN roles r ON e.role_id = r.id
                  JOIN departments d on d.id = r.department_id
                  LEFT JOIN employees m ON e.manager_id = m.id;
                `);
                console.table(rows);
            } catch (err) {
                console.error(err);
            }
            break;


        // Add a department
        case 'Add a department':
            console.log('no rly3')
          break;


        // Add a role  
        case 'Add a role':
            console.log('no rly4')
          break;


        // Add an emmployee  
        case 'Add an employee':
            console.log('no rly5')
          break;


        // Update an employee role  
        case 'Update an employee role':
            console.log('no rly6')
          break;


        // Exits the main menu loop  
        case 'Exit':
          db.end()
          break;
      }
    }
  }
  
  // call the mainMenu function to start the menu loop
  mainMenu();
