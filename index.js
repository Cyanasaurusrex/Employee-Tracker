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

inquirer
.prompt(questions)