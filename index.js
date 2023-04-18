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
            try{
              const answer = await inquirer.prompt({
                type: 'input',
                message: 'What is the name of the department',
                name: 'deptName',
                validate: (answer) => {
                    if (answer.length != 3) {
                        return 'Please enter only 3 characters'
                    }
                    return true
                }
              })
              db.query(`INSERT INTO departments (name) VALUES ('${answer.deptName}')`, (error) => {
                if (error) {
                  console.error(error);
                } else {
                  console.log(`Added department '${answer.deptName}' to database.`);
                }
              });
          } catch (err) {
            console.error(err)
          }
          break;


        // Add a role  
        case 'Add a role':
          try{
            const deptObj = await db.promise().query(`
              SELECT NAME FROM employee_chart_db.departments;
            `);                
            const deptArr = deptObj[0]
            const depts = deptArr.map(deptArr => deptArr.NAME)
            console.log(depts)
            const answer = await inquirer.prompt([{
                type: 'input',
                message: 'What is the name of the role?',
                name: 'roleName'
              },
              {
                type: 'input',
                message: 'What is the salary?',
                name: 'roleSalary'
              },
              {
                type: 'list',
                name: 'roleDept',
                message: 'What is the department?',
                choices: depts
              }                             
            ])            
            const roleDept_id = depts.indexOf(answer.roleDept) + 1;
            console.log(`INSERT INTO roles (title, department_id, salary) VALUES ('${answer.roleName}', ${roleDept_id}, ${answer.roleSalary} );`)
            db.query(`INSERT INTO roles (title, department_id, salary) VALUES ('${answer.roleName}', ${roleDept_id}, ${answer.roleSalary} );`, (error) => {
              if (error) {
                console.error(error);
              } else {
                console.log(`Added department '${answer.deptName}' to database.`);
              }
            });
          }
          catch (err) {
          console.error(err)
          }
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


