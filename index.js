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
                name: 'deptName'
                }
              )
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
          // queries the db and creates an array of roles
          const roleObj = await db.promise().query(`
              SELECT title FROM employee_chart_db.roles;
            `);                           
          const roleArr = roleObj[0]
          const roles = roleArr.map(({ title }) => title)
          
          // queries the db and creates an array of managers
          const managerObj = await db.promise().query(`
              SELECT CONCAT(first_name, ' ', last_name) AS manager
              FROM employees;`)
          const managerArr = managerObj[0]
          const managers = ['none', ...managerArr.map(({manager}) => manager)]
          const answer = await inquirer.prompt([{
            type: 'input',
            message: 'What is the first name of the employee?',
            name: 'empFirst'
          },
          {
            type: 'input',
            message: 'What is the last name of the employee?',
            name: 'empLast'
          },
          {
            type: 'list',
            name: 'empRole',
            message: 'What is the role of the employee?',
            choices: roles
          },
          {
            type: 'list',
            name: 'empManager',
            message: 'Who is the manager of the employee?',
            choices: managers
          }                            
        ])
          let empManager_id
           const empRole_id = roles.indexOf(answer.empRole) + 1
           if (answer.empManager === 'none') {
            empManager_id = null;
          } else {
            empManager_id = managers.indexOf(answer.empManager) + 1;
          }
           db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${answer.empFirst}', '${answer.empLast}', ${empRole_id}, ${empManager_id} );`, (error) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`Added department '${answer.deptName}' to database.`);
            }
          });         
            break;


        // Update an employee role  
        case 'Update an employee role':
          const empObj = await db.promise().query(`
              SELECT CONCAT(first_name, ' ', last_name) AS employee
              FROM employees;`)
          const empArr = empObj[0]
          const employees = empArr.map(({employee}) => employee)
          const empRoleObj = await db.promise().query(`
              SELECT title FROM employee_chart_db.roles;
            `);                           
          const empRoleArr = empRoleObj[0]
          const empRoles = empRoleArr.map(({ title }) => title)
          const updateAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'updateEmployee',
            message: 'Which employee is changing roles?',
            choices: employees
          },
          {
            type: 'list',
            name: 'updateRole',
            message: 'What is the employee\'s new role?',
            choices: empRoles
          }])
          
          newRole_idObj = await db.promise().query(`SELECT id FROM roles WHERE title = '${updateAnswer.updateRole}';`)
          let newRole_id = newRole_idObj[0][0].id
          
          const [first_name, last_name] = updateAnswer.updateEmployee.split(' ');
          db.query(`UPDATE employees SET role_id = ${newRole_id} WHERE first_name = '${first_name}' AND last_name = '${last_name}';`, (error) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`Added to database.`);
            }})
        break;          
          

        // Exits the main menu loop  
        case 'Exit':
          db.end()
          break;
      }
    }
  }
  

  async function updateRole () {
    
  }
  // call the mainMenu function to start the menu loop

  mainMenu();


